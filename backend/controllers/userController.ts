import { Request, Response } from "express";
import User from "../models/User";

// Get All Users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({message: "Kullanıcılar alınamadı.", error: error.message})        
    }
};

// Get Single User
export const getUser = async (req: Request, res:Response) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(500).json({message: "Kullanıcı bulunamadı."});
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: "Kullanıcı alınamadı", error: error.message });

    }
};

// Add User
export const addUser = async (req: Request, res:Response) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
      } catch (error: any) {
        res.status(400).json({ message: "Kullanıcı oluşturulamadı", error: error.message });
      }
};

// Update User

export const updateUser = async (req: Request, res: Response) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true, // schema validasyonlarını tekrar çalıştırır
      });
      if (!updatedUser) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ message: "Kullanıcı güncellenemedi", error: error.message });
    }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      res.status(200).json({
        success: true,
        message: "Kullanıcı silindi",
        user: {
          "_id": "68a8a30885e1b801102939f8",
          "username": "user1",
          "email": "user1@test.com"
        }
      });
    } catch (error: any) {
      res.status(500).json({ "success": false, message: "Kullanıcı silinemedi", error: error.message });
    }
};