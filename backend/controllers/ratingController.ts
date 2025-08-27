import Rating from "../models/Rating";
import { IGetUserAuthInfoRequest } from "./authController";
import { Request, Response } from "express";

export const ratePhoto = async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const { photoId } = req.params;
      const userId = req.user!.id;
      const { rating } = req.body;
  
      const existingRating = await Rating.findOne({ user_id: userId, photo_id: photoId });

      if (existingRating) {
        return res.status(400).json({ message: "You have already rated this photo." });
      }

      /* const updated = await Rating.findOneAndUpdate(
        { user_id: userId, photo_id: photoId },
        { rating, updated_at: new Date() },
        { new: true, upsert: true }
      ); */

      const newRating = await Rating.create({
        user_id: userId,
        photo_id: photoId,
        rating,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return res.status(200).json({ message: "Photo rated.", rating: newRating });
    } catch (error) {
      return res.status(500).json({ message: "Failed to rate photo.", error });
    }
  };
  
  export const getPhotoRatings = async (req: Request, res: Response) => {
    try {
      const { photoId } = req.params;
  
      const ratings = await Rating.find({ photo_id: photoId });
      const totalVotes = ratings.length;
      const averageRating = totalVotes
        ? ratings.reduce((acc, r) => acc + r.rating, 0) / totalVotes
        : 0;
  
      return res.status(200).json({ averageRating, totalVotes });
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch ratings.", error });
    }
  };
  