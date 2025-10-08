import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import cloudinary from "../config/cloudinary";
import Photo from "../models/Photo";
import Like from "../models/Likes";
import Category from "../models/Categories";
import Comment from "../models/Comment";
import { IGetUserAuthInfoRequest } from "./authController";
import { AppError } from "../utils/AppError";
import {
  IUser,
  ICategory,
  IPhotoDocument,
  IPhotoPopulated,
  ILikeDocument,
  ICommentDocument,
  IPhotoQueryFilter,
  IPhotoResponse,
  IPhotoWithCommentsResponse,
  IPopularPhotoAggregateResult,
  IGetAllPhotosResponse,
  IGetPhotoResponse,
  IGetPhotosWithCommentsResponse,
  IGetPopularPhotosResponse,
  ILikeAggregateResult,
  LikeCountMap,
  CommentCountMap,
} from "../types/photo.types";

const getAllPhotos = async (
  req: IGetUserAuthInfoRequest,
  res: Response<IGetAllPhotosResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const limit: number = parseInt(req.query.limit as string) || 15;
    const offset: number = parseInt(req.query.offset as string) || 0;
    const search: string | undefined = (req.query.search as string)?.trim();
    const sort: string | undefined = req.query.sort as string;
    const categoriesQuery: string | undefined = req.query.categories as string;

    const query: IPhotoQueryFilter = {};

    if (search && search.length > 0) {
      query.title = { $regex: search, $options: "i" };
    }

    if (categoriesQuery) {
      const categoryNames: string[] = categoriesQuery
        .split(",")
        .map((c: string) => c.trim())
        .filter((c: string) => c.length > 0);

      if (categoryNames.length > 0) {
        const categoryDocuments = await Category.find({
          name: { $in: categoryNames },
        })
          .select("_id")
          .lean<Pick<ICategory, "_id">[]>();

        const categoryIds: Types.ObjectId[] = categoryDocuments.map(
          (doc) => new mongoose.Types.ObjectId(doc._id)
        );

        if (categoryIds.length > 0) {
          query.categories = { $in: categoryIds };
        } else {
          query.categories = { $in: [new mongoose.Types.ObjectId()] };
        }
      }
    }

    const total: number = await Photo.countDocuments(query);

    let photos: (IPhotoPopulated | IPhotoDocument)[];

    if (sort === "random") {
      const aggregateResult = await Photo.aggregate([
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
        {
          $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "categories",
          },
        },
      ]);
      photos = aggregateResult as IPhotoPopulated[];
    } else {
      photos = await Photo.find(query)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit)
        .populate<{ user_id: IUser }>(
          "user_id",
          "username email profile_img_url created_at"
        )
        .populate<{ categories: ICategory[] }>("categories", "name")
        .lean<IPhotoPopulated[]>();
    }

    const loggedInUserId: string | undefined = req.user?.id;

    const photoIds: Types.ObjectId[] = photos.map(
      (photo) => new mongoose.Types.ObjectId(photo._id)
    );

    let isLikedMap = new Set<string>();
    if (loggedInUserId) {
      const userLikes = await Like.find({
        photo_id: { $in: photoIds },
        user_id: new mongoose.Types.ObjectId(loggedInUserId),
      }).lean<ILikeDocument[]>();

      isLikedMap = new Set(
        userLikes.map((like: ILikeDocument) => like.photo_id.toString())
      );
    }

    const likes = await Like.find({ photo_id: { $in: photoIds } }).lean<
      ILikeDocument[]
    >();

    const likeCounts: LikeCountMap = likes.reduce(
      (acc: LikeCountMap, like: ILikeDocument) => {
        const photoIdStr: string = like.photo_id.toString();
        acc[photoIdStr] = (acc[photoIdStr] || 0) + 1;
        return acc;
      },
      {}
    );

    const data: IPhotoResponse[] = photos.map((photo) => {
      const photoIdStr: string = photo._id.toString();
      const typedPhoto = photo as IPhotoPopulated;

      return {
        _id: typedPhoto._id,
        photo_url: typedPhoto.photo_url,
        title: typedPhoto.title,
        description: typedPhoto.description,
        tags: typedPhoto.tags,
        categories: typedPhoto.categories,
        created_at: typedPhoto.created_at,
        user: typedPhoto.user_id,
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
  } catch (error) {
    const errorMessage: string =
      error instanceof Error ? error.message : "Fotoğraflar bulunamadı";
    next(new AppError(errorMessage, 500));
  }
};

const getPhoto = async (
  req: IGetUserAuthInfoRequest,
  res: Response<IGetPhotoResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate<{ user_id: IUser }>(
        "user_id",
        "username email profile_img_url created_at"
      )
      .populate<{ categories: ICategory[] }>("categories", "name")
      .lean<IPhotoPopulated>();

    if (!photo) return next(new AppError("Photo not found.", 404));

    const loggedInUserId: string | undefined = req.user?.id;
    const likeCount: number = await Like.countDocuments({
      photo_id: photo._id,
    });
    const isLikedByMe: boolean = loggedInUserId
      ? !!(await Like.exists({ user_id: loggedInUserId, photo_id: photo._id }))
      : false;

    res.status(200).json({
      status: true,
      data: {
        _id: photo._id,
        photo_url: photo.photo_url,
        title: photo.title,
        description: photo.description,
        tags: photo.tags,
        categories: photo.categories,
        created_at: photo.created_at,
        user: photo.user_id,
        likeCount,
        isLikedByMe,
      },
    });
  } catch (error) {
    const errorMessage: string =
      error instanceof Error ? error.message : "Photo not found";
    next(new AppError(errorMessage, 500));
  }
};

const createPhoto = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) return next(new AppError("Photo required", 400));

    const result = cloudinary.uploader.upload_stream(
      { folder: "photos_app" },
      async (error, uploaded) => {
        if (error) return next(new AppError("Upload Error", 500));

        let categoriesArray: string[] = [];
        if (req.body.categories) {
          if (typeof req.body.categories === "string") {
            categoriesArray = req.body.categories
              .split(",")
              .map((c: string) => c.trim());
          } else if (Array.isArray(req.body.categories)) {
            categoriesArray = req.body.categories;
          }
        }

        if (categoriesArray.length < 1 || categoriesArray.length > 3) {
          return next(new AppError("1-3 arası kategori seçmelisiniz", 400));
        }

        const tags: string[] = req.body.tags
          ? req.body.tags.split(",").map((t: string) => t.trim())
          : [];

        const photo = await Photo.create({
          user_id: req.user!.id,
          photo_url: uploaded?.secure_url,
          title: req.body.title,
          description: req.body.description,
          tags,
          categories: categoriesArray,
        });

        res.status(201).json({ success: true, photo });
      }
    );

    if (req.file?.buffer) result.end(req.file.buffer);
  } catch (err) {
    const errorMessage: string =
      err instanceof Error ? err.message : "Sunucu hatası";
    next(new AppError(errorMessage, 500));
  }
};

const updatePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
  } catch (error) {
    const errorMessage: string =
      error instanceof Error ? error.message : "Photo not updated";
    next(new AppError(errorMessage, 400));
  }
};

const deletePhoto = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedPhoto = await Photo.findById(
      req.params.id
    ).lean<IPhotoDocument>();
    if (!deletedPhoto) return next(new AppError("Photo not found", 404));

    const urlParts: string[] = deletedPhoto.photo_url.split("/");
    const fileNameWithExt: string = urlParts[urlParts.length - 1];
    const folder: string = "photos_app";
    const public_id: string = `${folder}/${fileNameWithExt.split(".")[0]}`;

    await cloudinary.uploader.destroy(public_id);
    await Photo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Photo deleted from Cloudinary and DB",
    });
  } catch (error) {
    const errorMessage: string =
      error instanceof Error ? error.message : "Could not delete photo";
    next(new AppError(errorMessage, 500));
  }
};

const getPhotoByUserId = async (
  req: Request,
  res: Response<IGetPhotosWithCommentsResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId: string = req.params.userId;
    const photos = await Photo.find({ user_id: userId })
      .populate<{ user_id: IUser }>(
        "user_id",
        "username email profile_img_url created_at"
      )
      .populate<{ categories: ICategory[] }>("categories", "name")
      .sort({ created_at: -1 })
      .lean<IPhotoPopulated[]>();

    if (!photos) {
      return next(new AppError("Photos not found for this user.", 404));
    }

    const photoIds: Types.ObjectId[] = photos.map(
      (photo) => new mongoose.Types.ObjectId(photo._id)
    );

    const [likes, comments] = await Promise.all([
      Like.find({ photo_id: { $in: photoIds } }).lean<ILikeDocument[]>(),
      Comment.find({ photo: { $in: photoIds } }).lean<ICommentDocument[]>(),
    ]);

    const likeCounts: LikeCountMap = likes.reduce(
      (acc: LikeCountMap, like: ILikeDocument) => {
        const photoIdStr: string = like.photo_id.toString();
        acc[photoIdStr] = (acc[photoIdStr] || 0) + 1;
        return acc;
      },
      {}
    );

    const commentCounts: CommentCountMap = comments.reduce(
      (acc: CommentCountMap, comment: ICommentDocument) => {
        if (comment.photo) {
          const photoIdStr: string = comment.photo.toString();
          acc[photoIdStr] = (acc[photoIdStr] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    const data: IPhotoWithCommentsResponse[] = photos.map((photo) => {
      const photoIdStr: string = photo._id.toString();
      return {
        _id: photo._id,
        photo_url: photo.photo_url,
        title: photo.title,
        description: photo.description,
        tags: photo.tags,
        categories: photo.categories,
        created_at: photo.created_at,
        user: photo.user_id,
        likeCount: likeCounts[photoIdStr] || 0,
        commentCount: commentCounts[photoIdStr] || 0,
        isLikedByMe: false,
      };
    });

    res.status(200).json({ status: true, data });
  } catch (error) {
    const errorMessage: string =
      error instanceof Error
        ? error.message
        : "An error occurred while fetching photos.";
    next(new AppError(errorMessage, 500));
  }
};

const getLikedPhotos = async (
  req: IGetUserAuthInfoRequest,
  res: Response<IGetPhotosWithCommentsResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId: string = req.params.userId;
    const likedPhotoIds = await Like.find({ user_id: targetUserId })
      .select("photo_id")
      .lean<Pick<ILikeDocument, "photo_id">[]>();

    const photoIds: Types.ObjectId[] = likedPhotoIds.map((doc) => doc.photo_id);

    const photos = await Photo.find({ _id: { $in: photoIds } })
      .populate<{ user_id: IUser }>(
        "user_id",
        "username full_name profile_img_url"
      )
      .populate<{ categories: ICategory[] }>("categories", "name")
      .sort({ created_at: -1 })
      .lean<IPhotoPopulated[]>();

    const [likeCounts, comments] = await Promise.all([
      Like.aggregate<ILikeAggregateResult>([
        { $match: { photo_id: { $in: photoIds } } },
        { $group: { _id: "$photo_id", count: { $sum: 1 } } },
      ]),
      Comment.find({ photo: { $in: photoIds } }).lean<ICommentDocument[]>(),
    ]);

    const likeCountMap = new Map<string, number>(
      likeCounts.map((item) => [item._id.toString(), item.count])
    );

    const commentCounts: CommentCountMap = comments.reduce(
      (acc: CommentCountMap, comment: ICommentDocument) => {
        if (comment.photo) {
          const photoIdStr: string = comment.photo.toString();
          acc[photoIdStr] = (acc[photoIdStr] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    const data: IPhotoWithCommentsResponse[] = photos.map((photo) => {
      const photoIdStr: string = photo._id.toString();
      return {
        _id: photo._id,
        photo_url: photo.photo_url,
        title: photo.title,
        description: photo.description,
        tags: photo.tags,
        categories: photo.categories,
        created_at: photo.created_at,
        user: photo.user_id,
        likeCount: likeCountMap.get(photoIdStr) || 0,
        commentCount: commentCounts[photoIdStr] || 0,
        isLikedByMe: true,
      };
    });

    res.status(200).json({ status: true, data });
  } catch (error) {
    const errorMessage: string =
      error instanceof Error ? error.message : "Sunucu hatası";
    next(new AppError(errorMessage, 500));
  }
};

const getPopularPhotos = async (
  req: IGetUserAuthInfoRequest,
  res: Response<IGetPopularPhotosResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const limit: number = parseInt(req.query.limit as string) || 10;
    const timeframe: string | undefined = req.query.timeframe as string;

    let dateFilter: IPhotoQueryFilter = {};
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

    const popularPhotos = await Photo.aggregate<IPopularPhotoAggregateResult>([
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

    const loggedInUserId: string | undefined = req.user?.id;
    let isLikedMap = new Set<string>();

    if (loggedInUserId && popularPhotos.length > 0) {
      const photoIds: Types.ObjectId[] = popularPhotos.map((photo) =>
        Types.ObjectId.createFromHexString(photo._id.toString())
      );
      const userLikes = await Like.find({
        photo_id: { $in: photoIds },
        user_id: new mongoose.Types.ObjectId(loggedInUserId),
      }).lean<ILikeDocument[]>();

      isLikedMap = new Set(
        userLikes.map((like: ILikeDocument) => like.photo_id.toString())
      );
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
      } as IUser,
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
  } catch (error) {
    const errorMessage: string =
      error instanceof Error ? error.message : "Could not fetch popular photos";
    next(new AppError(errorMessage, 500));
  }
};

export {
  getAllPhotos,
  getPhoto,
  createPhoto,
  updatePhoto,
  deletePhoto,
  getPhotoByUserId,
  getLikedPhotos,
  getPopularPhotos,
};
