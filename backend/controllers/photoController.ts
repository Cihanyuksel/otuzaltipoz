import { Request, Response, NextFunction } from "express";
import Photo from "../models/Photo";
import cloudinary from "../config/cloudinary";
import { IGetUserAuthInfoRequest } from "./authController";
import Like from "../models/Likes";
import Comment from "../models/Comment";
import mongoose, { Types } from "mongoose";
import { AppError } from "../utils/AppError";

const getAllPhotos = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 15;
    const offset = parseInt(req.query.offset as string) || 0;
    const search = (req.query.search as string)?.trim();
    const sort = req.query.sort as string;

    const query: any = {};
    if (search && search.length > 0)
      query.title = { $regex: search, $options: "i" };

    let photos;
    const total = await Photo.countDocuments(query);

    if (sort === "random") {
      photos = await Photo.aggregate([
        { $match: query },
        { $sample: { size: limit } },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user_id",
          },
        },
        { $unwind: "$user_id" },
      ]);
    } else {
      photos = await Photo.find(query)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit)
        .populate("user_id", "username email profile_img_url created_at")
        .lean();
    }

    const loggedInUserId = req.user?.id;

    const photoIds = photos.map(
      (photo: any) => new mongoose.Types.ObjectId(photo._id)
    );

    let isLikedMap = new Set();
    if (loggedInUserId) {
      const userLikes = await Like.find({
        photo_id: { $in: photoIds },
        user_id: new mongoose.Types.ObjectId(loggedInUserId),
      }).lean();
      isLikedMap = new Set(userLikes.map((like) => like.photo_id.toString()));
    }

    const likes = await Like.find({ photo_id: { $in: photoIds } }).lean();

    const likeCounts = likes.reduce((acc: { [key: string]: number }, like) => {
      const photoIdStr = like.photo_id.toString();
      acc[photoIdStr] = (acc[photoIdStr] || 0) + 1;
      return acc;
    }, {});

    const data = photos.map((photo: any) => {
      const photoIdStr = photo._id.toString();
      const { user_id, ...rest } = photo;
      return {
        ...rest,
        user: user_id,
        likeCount: likeCounts[photoIdStr] || 0,
        isLikedByMe: isLikedMap.has(photoIdStr),
      };
    });

    res.status(200).json({
      totalRecords: total,
      currentRecords: photos.length,
      status: true,
      data,
    });
  } catch (error: any) {
    next(new AppError(error.message || "Photos not found", 500));
  }
};

// Get photo by ID
const getPhoto = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate("user_id", "username email profile_img_url created_at")
      .lean();

    if (!photo) return next(new AppError("Photo not found.", 404));

    const loggedInUserId = req.user?.id;
    const likeCount = await Like.countDocuments({ photo_id: photo._id });
    const isLikedByMe = loggedInUserId
      ? await Like.exists({ user_id: loggedInUserId, photo_id: photo._id })
      : false;

    const { user_id, ...rest } = photo;
    res.status(200).json({
      status: true,
      data: { ...rest, user: user_id, likeCount, isLikedByMe: !!isLikedByMe },
    });
  } catch (error: any) {
    next(new AppError(error.message || "Photo not found", 500));
  }
};

// Upload photo
const uploadPhoto = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) return next(new AppError("Photo required", 400));

    const result = cloudinary.uploader.upload_stream(
      { folder: "photos_app" },
      async (error, uploaded) => {
        if (error) return next(new AppError("Upload Error", 500));
        const photo = await Photo.create({
          user_id: req.user!.id,
          photo_url: uploaded?.secure_url,
          title: req.body.title,
          description: req.body.description,
          tags: req.body.tags ? req.body.tags.split(",") : [],
        });

        res.status(201).json({ success: true, photo });
      }
    );

    if (req.file?.buffer) result.end(req.file.buffer);
  } catch (err: any) {
    next(new AppError(err.message || "Sunucu hatası", 500));
  }
};

// Update photo
const updatePhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedPhoto = await Photo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPhoto) return next(new AppError("Photo not found", 404));
    res.status(200).json(updatedPhoto);
  } catch (error: any) {
    next(new AppError(error.message || "Photo not updated", 400));
  }
};

// Delete photo
const deletePhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedPhoto = await Photo.findById(req.params.id);
    if (!deletedPhoto) return next(new AppError("Photo not found", 404));

    const urlParts = deletedPhoto.photo_url.split("/");
    const fileNameWithExt = urlParts[urlParts.length - 1];
    const folder = "photos_app";
    const public_id = `${folder}/${fileNameWithExt.split(".")[0]}`;

    await cloudinary.uploader.destroy(public_id);
    await Photo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Photo deleted from Cloudinary and DB",
    });
  } catch (error: any) {
    next(new AppError(error.message || "Could not delete photo", 500));
  }
};

const getPhotoByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const photos = await Photo.find({ user_id: userId })
      .populate("user_id", "username email profile_img_url created_at")
      .sort({ created_at: -1 })
      .lean();

    if (!photos)
      return next(new AppError("Photos not found for this user.", 404));

    const photoIds = photos.map(
      (photo) => new mongoose.Types.ObjectId(photo._id)
    );

    const [likes, comments] = await Promise.all([
      Like.find({ photo_id: { $in: photoIds } }).lean(),
      Comment.find({ photo: { $in: photoIds } }).lean(),
    ]);

    const likeCounts = likes.reduce((acc: { [key: string]: number }, like) => {
      const photoIdStr = like.photo_id.toString();
      acc[photoIdStr] = (acc[photoIdStr] || 0) + 1;
      return acc;
    }, {});

    const commentCounts = comments.reduce(
      (acc: { [key: string]: number }, comment) => {
        if (comment.photo) {
          const photoIdStr = comment.photo.toString();
          acc[photoIdStr] = (acc[photoIdStr] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    const data = photos.map((photo) => {
      const photoIdStr = photo._id.toString();
      const { user_id, ...rest } = photo;
      return {
        ...rest,
        user: user_id,
        likeCount: likeCounts[photoIdStr] || 0,
        commentCount: commentCounts[photoIdStr] || 0,
      };
    });

    res.status(200).json({ status: true, data });
  } catch (error: any) {
    next(
      new AppError(
        error.message || "An error occurred while fetching photos.",
        500
      )
    );
  }
};

// Get liked photos
const getLikedPhotos = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const targetUserId = req.params.userId;
    const likedPhotoIds = await Like.find({ user_id: targetUserId })
      .select("photo_id")
      .lean();
    const photoIds = likedPhotoIds.map((doc) => doc.photo_id);

    const photos = await Photo.find({ _id: { $in: photoIds } })
      .populate("user_id", "username fullname profile_img_url")
      .sort({ created_at: -1 })
      .lean();

    const [likeCounts, comments] = await Promise.all([
      Like.aggregate([
        { $match: { photo_id: { $in: photoIds } } },
        { $group: { _id: "$photo_id", count: { $sum: 1 } } },
      ]),
      Comment.find({ photo: { $in: photoIds } }).lean(),
    ]);

    const likeCountMap = new Map(
      likeCounts.map((item) => [item._id.toString(), item.count])
    );

    const commentCounts = comments.reduce(
      (acc: { [key: string]: number }, comment) => {
        if (comment.photo) {
          const photoIdStr = comment.photo.toString();
          acc[photoIdStr] = (acc[photoIdStr] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    const data = photos.map((photo) => {
      const { user_id, ...rest } = photo;
      const photoIdStr = photo._id.toString();
      return {
        ...rest,
        user: user_id,
        likeCount: likeCountMap.get(photoIdStr) || 0,
        commentCount: commentCounts[photoIdStr] || 0,
      };
    });

    res.status(200).json({ status: true, data });
  } catch (error: any) {
    next(new AppError(error.message || "Sunucu hatası", 500));
  }
};

const getPopularPhotos = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const timeframe = req.query.timeframe as string; 

    let dateFilter = {};
    if (timeframe === "day") {
      const dayAgo = new Date();
      dayAgo.setHours(0, 0, 0, 0);
      dateFilter = { created_at: { $gte: dayAgo } };
    } else if (timeframe === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { created_at: { $gte: weekAgo } };
    } else if (timeframe === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { created_at: { $gte: monthAgo } };
    }

    const popularPhotos = await Photo.aggregate([
      { $match: dateFilter },

      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "photo_id",
          as: "likes",
        },
      },

      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "photo",
          as: "comments",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },

      { $unwind: "$user" },

      {
        $addFields: {
          likeCount: { $size: "$likes" },
          commentCount: { $size: "$comments" },
          popularityScore: {
            $add: [
              { $size: "$likes" },
              { $multiply: [{ $size: "$comments" }, 2] },
            ],
          },
        },
      },

      { $sort: { popularityScore: -1 } },

      { $limit: limit },

      {
        $project: {
          likes: 0,
          comments: 0,
          "user.password": 0,
          "user.role": 0,
          "user.is_active": 0,
          "user.is_verified": 0,
        },
      },
    ]);

    const loggedInUserId = req.user?.id;
    let isLikedMap = new Set();

    if (loggedInUserId && popularPhotos.length > 0) {
      /*const photoIds = popularPhotos.map(
        (photo) => new mongoose.Types.ObjectId(photo._id)
      );*/
      const photoIds = popularPhotos.map((photo) =>
        Types.ObjectId.createFromHexString(photo._id.toString())
      );
      const userLikes = await Like.find({
        photo_id: { $in: photoIds },
        user_id: new mongoose.Types.ObjectId(loggedInUserId),
      }).lean();
      isLikedMap = new Set(userLikes.map((like) => like.photo_id.toString()));
    }

    const data = popularPhotos.map((photo) => ({
      _id: photo._id,
      photo_url: photo.photo_url,
      title: photo.title,
      description: photo.description,
      tags: photo.tags,
      created_at: photo.created_at,
      updated_at: photo.updated_at,
      user: {
        _id: photo.user._id,
        username: photo.user.username,
        full_name: photo.user.full_name,
        profile_img_url: photo.user.profile_img_url,
      },
      likeCount: photo.likeCount,
      commentCount: photo.commentCount,
      popularityScore: photo.popularityScore,
      isLikedByMe: isLikedMap.has(photo._id.toString()),
    }));

    res.status(200).json({
      status: true,
      totalRecords: data.length,
      data,
    });
  } catch (error: any) {
    next(new AppError(error.message || "Could not fetch popular photos", 500));
  }
};

export {
  getAllPhotos,
  getPhoto,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
  getPhotoByUserId,
  getLikedPhotos,
  getPopularPhotos,
};
