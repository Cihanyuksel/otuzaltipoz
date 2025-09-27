import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { AppError } from "../utils/AppError";
import { refreshTokenCookieConfig } from "../config/cookieConfig";

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

// Update User
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return next(new AppError("User not found", 404));
    res.status(200).json(updatedUser);
  } catch (error: any) {
    next(new AppError(error.message || "User not updated", 400));
  }
};

// Delete User
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return next(new AppError("User not found", 404));

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    });

    res.status(200).json({
      success: true,
      message: "User deleted and logout",
      user: {
        _id: deletedUser._id,
        username: deletedUser.username,
        email: deletedUser.email,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message || "Could not delete user", 500));
  }
};

export { getAllUsers, getUser, addUser, updateUser, deleteUser };
