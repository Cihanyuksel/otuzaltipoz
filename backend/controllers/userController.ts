import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import { AppError } from "../utils/AppError";
import { IGetUserAuthInfoRequest } from "./authController";
import { checkOwnershipOrRole } from "../utils/authorization";
import cloudinary from "../config/cloudinary";

// Get All Users
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: any) {
    next(new AppError(error.message || "Users not found.", 500));
  }
};

// Get user by ID
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found.", 404));
    res.status(200).json(user);
  } catch (error: any) {
    next(new AppError(error.message || "User not found", 500));
  }
};

// Add User
const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error: any) {
    next(new AppError(error.message || "Could not create user", 400));
  }
};

// Update User Profile
const updateUser = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { full_name, bio, removeProfileImg } = req.body;

    // Authorization check
    if (req.user?.id !== id && req.user?.role !== "admin") {
      return next(new AppError("Bu işlem için yetkiniz yok", 403));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError("Kullanıcı bulunamadı", 404));
    }

    // Update basic fields
    if (full_name) user.full_name = full_name.trim();
    if (bio !== undefined) user.bio = bio.trim();

    // Handle profile image removal
    if (removeProfileImg === 'true' || removeProfileImg === true) {
      if (user.profile_img_url) {
        try {
          // Extract public_id from cloudinary URL
          const urlParts = user.profile_img_url.split('/');
          const filename = urlParts[urlParts.length - 1];
          const publicId = `photos_app/profiles/${filename.split('.')[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudErr) {
          console.error("Cloudinary delete error:", cloudErr);
        }
      }
      user.profile_img_url = undefined;
    }

    // Handle new profile image upload
    if (req.file?.buffer && removeProfileImg !== 'true' && removeProfileImg !== true) {
      try {
        // Delete old image if exists
        if (user.profile_img_url) {
          try {
            const urlParts = user.profile_img_url.split('/');
            const filename = urlParts[urlParts.length - 1];
            const publicId = `photos_app/profiles/${filename.split('.')[0]}`;
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudErr) {
            console.error("Old image delete error:", cloudErr);
          }
        }

        // Upload new image
        const uploadResult: any = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "photos_app/profiles",
              transformation: [
                { width: 300, height: 300, crop: "fill", gravity: "face" },
                { quality: "auto", format: "webp" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file!.buffer);
        });

        user.profile_img_url = uploadResult.secure_url;
      } catch (cloudErr: any) {
        console.error("Cloudinary upload error:", cloudErr);
        return next(
          new AppError("Profil resmi yüklenirken bir hata oluştu.", 500)
        );
      }
    }

    await user.save();

    res.json({
      success: true,
      message: "Profil başarıyla güncellendi",
      data: {
        _id: user._id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        bio: user.bio,
        profile_img_url: user.profile_img_url,
        role: user.role,
        is_active: user.is_active,
        is_verified: user.is_verified,
        username_change_count: user.username_change_count,
      },
    });
  } catch (err: any) {
    console.error("Update user error:", err);
    next(new AppError(err.message || "Sunucu hatası", 500));
  }
};


// Update Username (ONLY ONCE)
const updateUsername = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user!;
    const { username } = req.body;

    // Ownership check
    if (userId !== currentUser.id.toString() && currentUser.role !== "admin") {
      return next(new AppError("You can only update your own username", 403));
    }

    if (!username || username.trim().length < 3) {
      return next(new AppError("Username must be at least 3 characters", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Check if user already changed username
    if (user.username_change_count >= 1 && currentUser.role !== "admin") {
      return next(new AppError("You can only change your username once", 403));
    }

    // Check if username is already taken
    const existingUser = await User.findOne({
      username: username.toLowerCase(),
      _id: { $ne: userId },
    });

    if (existingUser) {
      return next(new AppError("This username is already taken", 400));
    }

    user.username = username.toLowerCase();
    user.username_change_count += 1;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Username successfully updated",
      data: {
        username: user.username,
        username_change_count: user.username_change_count,
        can_change_again: user.username_change_count < 1,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message || "Username update failed", 400));
  }
};

// Update Password
const updatePassword = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user!;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Ownership check
    if (userId !== currentUser.id.toString() && currentUser.role !== "admin") {
      return next(new AppError("You can only update your own password", 403));
    }

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return next(new AppError("All password fields are required", 400));
    }

    if (newPassword !== confirmPassword) {
      return next(new AppError("New passwords do not match", 400));
    }

    if (newPassword.length < 6) {
      return next(new AppError("Password must be at least 6 characters", 400));
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (currentUser.role !== "admin") {
      const isPasswordCorrect = await user.comparePassword(currentPassword);
      if (!isPasswordCorrect) {
        return next(new AppError("Current password is incorrect", 401));
      }
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: "true",
      message: "Password successfully updated",
    });
  } catch (error: any) {
    next(new AppError(error.message || "Password update failed", 400));
  }
};

// Delete User
const deleteUser = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user;

    if (!currentUser) {
      return next(new AppError("Authentication required", 401));
    }

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return next(new AppError("User not found", 404));
    }

    const isAdmin = currentUser.role === "admin";
    const isModerator = currentUser.role === "moderator";
    const isOwner = userId === currentUser.id.toString();

    // Authorization check
    checkOwnershipOrRole(userId.toString(), req, ["admin", "moderator"]);

    // Admin restrictions
    if (isAdmin && userToDelete.role === "admin" && !isOwner) {
      return next(new AppError("Admins cannot delete other admins", 403));
    }

    // Moderator restrictions
    if (isModerator) {
      if (userToDelete.role === "admin" || userToDelete.role === "moderator") {
        return next(
          new AppError(
            "Moderators cannot delete other moderators or admins",
            403
          )
        );
      }
    }

    // Last admin check
    if (isOwner && currentUser.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return next(new AppError("Cannot delete the last admin user", 403));
      }
    }

    await User.findByIdAndDelete(userId);

    // Logout if deleting own account
    if (isOwner) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
      });
    }

    res.status(200).json({
      status: "success",
      message: isOwner
        ? "Your account has been deleted and you have been logged out"
        : "User deleted successfully",
      data: {
        deletedUser: {
          _id: userToDelete._id,
          username: userToDelete.username,
          email: userToDelete.email,
        },
      },
    });
  } catch (error: any) {
    next(new AppError(error.message || "Could not delete user", 500));
  }
};

export {
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  updateUsername,
  updatePassword,
  deleteUser,
};
