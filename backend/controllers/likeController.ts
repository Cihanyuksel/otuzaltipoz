import { Response, NextFunction } from "express";
import Like from "../models/Likes";
import { IGetUserAuthInfoRequest } from "./authController";
import { AppError } from "../utils/AppError";

const getPhotoLikes = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  try {
    const { photoId } = req.params;
    const userId = req.user?.id;

    const likes = await Like.find({ photo_id: photoId })
      .populate({ path: 'user_id', select: 'username profile_img_url role' });

    const likeCount = likes.length;
    const usersWhoLiked = likes.map(like => like.user_id);
    const isLikedByMe = likes.some(like => like.user_id.equals(userId));

    res.status(200).json({ photoId, likeCount, isLikedByMe, usersWhoLiked });
  } catch (error: any) {
    console.error("Get photo likes error:", error);
    next(new AppError(error.message || "Failed to retrieve like count.", 500));
  }
};

const toggleLike = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  try {
    const { photoId } = req.params;
    const userId = req.user!.id;

    let isLikedByMe = false;
    let likeCount = await Like.countDocuments({ photo_id: photoId });

    const existingLike = await Like.findOne({ user_id: userId, photo_id: photoId });

    if (existingLike) {
      await Like.findOneAndDelete({ user_id: userId, photo_id: photoId });
      isLikedByMe = false;
      likeCount--;
      return res.status(200).json({ message: "Like removed successfully.", isLikedByMe, likeCount });
    } else {
      const newLike = new Like({ user_id: userId, photo_id: photoId });
      await newLike.save();
      isLikedByMe = true;
      likeCount++;
      return res.status(201).json({ message: "Photo liked successfully.", like: newLike, isLikedByMe, likeCount });
    }
  } catch (error: any) {
    console.error("Toggle like error:", error);
    next(new AppError(error.message || "Failed to toggle like.", 500));
  }
};

export { toggleLike, getPhotoLikes };
