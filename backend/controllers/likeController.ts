import { Request, Response } from "express";
import Like from "../models/Likes";
import { IGetUserAuthInfoRequest } from "./authController";
import mongoose from "mongoose";

interface IUserPopulated {
  _id: string;
  username: string;
}

interface ILikePopulated {
  _id: string;
  photo_id: string;
  user_id: IUserPopulated;
  created_at: Date;
}

const likePhoto = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
 
    const { photoId } = req.params;
    const userId = req.user!.id; 
    
    const existingLike = await Like.findOne({ user_id: userId, photo_id: photoId });
    if (existingLike) {
      return res.status(400).json({ message: "You already liked this photo." });
    }

    const like = new Like({ user_id: userId, photo_id: photoId });
    await like.save();

    return res.status(201).json({ message: "Photo liked.", like });
  } catch (error) {
    return res.status(500).json({ message: "Failed to like the photo.", error });
  }
};

const unlikePhoto = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { photoId } = req.params;
    const userId = req.user!.id;

    const like = await Like.findOneAndDelete({ user_id: userId, photo_id: photoId });

    if (!like) {
      return res.status(404).json({ message: "Like not found." });
    }

    return res.status(200).json({ message: "Like removed." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove like.", error });
  }
};

const getPhotoLikes = async (req: Request, res: Response) => {
  try {
    const { photoId } = req.params;

    const likeCount = await Like.countDocuments({ photo_id: photoId });

    const likes = await Like.find({ photo_id: photoId })
      .populate<{ user_id: IUserPopulated }>("user_id", "username")
      .lean<ILikePopulated[]>();

    const likedUsers = likes.map(like => {
      const user = like.user_id as unknown as { _id: string; username: string };
      return {
        userId: user._id,
        username: user.username
      };
    });
    
    return res.status(200).json({ photoId, likeCount, likes: likedUsers });
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve like count.", error });
  }
};  


export {
  likePhoto,
  unlikePhoto,
  getPhotoLikes
}