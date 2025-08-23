import { Request, Response } from "express";
import User from "../models/User";

// Get All Users
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({status: false, message: "Users not found.", error: error.message})        
    }
};

// Get user by ID
const getUser = async (req: Request, res:Response) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(500).json({message: "User not found."});
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ status: false, message: "User not found", error: error.message });

    }
};

// Add User
const addUser = async (req: Request, res:Response) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
      } catch (error: any) {
        res.status(400).json({ status: false, message: "Could not create user", error: error.message });
      }
};

// Update User
const updateUser = async (req: Request, res: Response) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true, 
      });
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ status: false, message: "User not updated", error: error.message });
    }
};

// Delete User
const deleteUser = async (req: Request, res: Response) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).json({status: false, message: "User not found" });
      res.status(200).json({
        success: true,
        message: "User deleted",
        user: {
          _id: deletedUser._id,
          username: deletedUser.username,
          email: deletedUser.email
        }
      });
    } catch (error: any) {
      res.status(500).json({ status: false, message: "Could not delete user", error: error.message });
    }
};

export {
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser
}