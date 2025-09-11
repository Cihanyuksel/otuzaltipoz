import { Response } from "express";
import Like from "../models/Likes";
import { IGetUserAuthInfoRequest } from "./authController";

const getPhotoLikes = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { photoId } = req.params;
    const userId = req.user?.id;

    // Fotoğrafı beğenen tüm 'Like' belgelerini bul ve 'user_id' referansını 'User' modeliyle doldur.
    const likes = await Like.find({ photo_id: photoId })
      .populate({
        path: 'user_id',
        select: 'username profile_img_url',
      });

    const likeCount = likes.length;

    // Beğenen kullanıcıların listesini oluştur
    const usersWhoLiked = likes.map(like => like.user_id);

    // Kendi beğenip beğenmediğini kontrol et
    const isLikedByMe = likes.some(like => like.user_id.equals(userId));

    return res.status(200).json({ photoId, likeCount, isLikedByMe, usersWhoLiked });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve like count.", error });
  }
};

const toggleLike = async (req: IGetUserAuthInfoRequest, res: Response) => {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to toggle like.", error });
  }
};

export {
  toggleLike,
  getPhotoLikes
}