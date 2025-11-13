import Photo from "../models/Photo";
import Rating from "../models/Rating";
import { IGetUserAuthInfoRequest } from "./authController";
import { Request, Response } from "express";

export const ratePhoto = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    const { photoId } = req.params;
    const userId = req.user!.id;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Geçerli bir puan giriniz (1-5 arasında).",
      });
    }

    const photoExists = await Photo.findById(photoId);
    if (!photoExists) {
      return res.status(404).json({
        message: "Fotoğraf bulunamadı.",
      });
    }

    const existingRating = await Rating.findOne({
      user_id: userId,
      photo_id: photoId,
    });

    if (existingRating) {
      return res.status(409).json({
        message: "Bu fotoğrafı zaten oyladınız.",
        code: "ALREADY_RATED",
      });
    }

    const newRating = await Rating.create({
      user_id: userId,
      photo_id: photoId,
      rating,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({
      message: "Fotoğraf başarıyla oylandı.",
      rating: newRating,
      success: true,
    });
  } catch (error) {
    console.error("Rating creation error:", error);
    return res.status(500).json({
      message: "Fotoğraf oylanırken bir hata oluştu.",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const getPhotoRatings = async (req: Request, res: Response) => {
  try {
    const { photoId } = req.params;

    const photoExists = await Photo.findById(photoId);
    if (!photoExists) {
      return res.status(404).json({
        message: "Fotoğraf bulunamadı.",
      });
    }

    const ratings = await Rating.find({ photo_id: photoId });
    const totalVotes = ratings.length;
    const averageRating = totalVotes
      ? Math.round(
          (ratings.reduce((acc, r) => acc + r.rating, 0) / totalVotes) * 10
        ) / 10
      : 0;

    return res.status(200).json({
      message: "Fotoğrafın oylama bilgileri başarıyla getirildi",
      success: true,
      data: {
        photoId,
        averageRating,
        totalVotes,
      },
    });
  } catch (error) {
    console.error("Get ratings error:", error);
    return res.status(500).json({
      message: "Oylamalar alınırken bir hata oluştu.",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
