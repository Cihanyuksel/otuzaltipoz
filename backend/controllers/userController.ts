import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import { AppError } from "../utils/AppError";
import { IGetUserAuthInfoRequest } from "./authController";
import { checkOwnershipOrRole } from "../utils/authorization";

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

//Update User
const updateUser = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user!; // REFACTOR IHTIYACI

    if (currentUser.role !== "admin" && currentUser.role !== "moderator") {
      if (userId !== currentUser.id.toString()) {
        return next(new AppError("You can only update your own profile", 403));
      }
    }

    if (req.body.role) {
      if (currentUser.role !== "admin") {
        return next(new AppError("Only admins can change user roles", 403));
      }

      if (userId === currentUser.id.toString() && req.body.role !== "admin") {
        return next(new AppError("You cannot change your own admin role", 403));
      }
    }

    const protectedFields = ["password", "is_verified", "created_at"];
    protectedFields.forEach((field) => {
      if (req.body[field] && currentUser.role !== "admin") {
        delete req.body[field];
      }
    });

    if (req.body.email) {
      if (currentUser.role !== "admin") {
        req.body.is_verified = false;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (error: any) {
    next(new AppError(error.message || "User not updated", 400));
  }
};

//Delete User
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

    // Yetki kontrolü
    checkOwnershipOrRole(userId.toString(), req, ["admin", "moderator"]);

    // Admin kısıtlamaları
    if (isAdmin && userToDelete.role === "admin" && !isOwner) {
      return next(new AppError("Admins cannot delete other admins", 403));
    }

    // Moderator kısıtlamaları
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

    // Son admini silme kontrolü
    if (isOwner && currentUser.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return next(new AppError("Cannot delete the last admin user", 403));
      }
    }

    await User.findByIdAndDelete(userId);

    // Kendi hesabını silen kullanıcıyı logout et
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

export { getAllUsers, getUser, addUser, updateUser, deleteUser };
