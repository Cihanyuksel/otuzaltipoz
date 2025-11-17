import { Request, Response, NextFunction } from "express";
import Comment from "../models/Comment";
import { IGetUserAuthInfoRequest } from "./authController";
import { AppError } from "../utils/AppError";
import { checkOwnershipOrRole } from "../utils/authorization";
import Photo from "../models/Photo";
import mongoose from "mongoose";

// Add comment
const addComment = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { photoId } = req.params;
    const { text, parentComment } = req.body;

    const photoExists = await Photo.findById(photoId);
    if (!photoExists) {
      return next(new AppError("Photo not found", 404));
    }

    let finalParentComment = null;

    if (parentComment) {
      const parent = await Comment.findById(parentComment);

      if (!parent) {
        return next(new AppError("Parent comment not found", 404));
      }

      if (parent.parentComment) {
        return next(
          new AppError(
            "Replies to replies are not allowed (Sadece 1 seviye yoruma izin verilir)",
            400
          )
        );
      }

      finalParentComment = parent._id;
    }

    const comment = await Comment.create({
      photo: photoId,
      user: req.user?.id,
      text,
      parentComment: finalParentComment,
    });

    res.status(201).json({
      message: "Yorum başarıyla eklendi.",
      success: true,
      data: comment,
    });
  } catch (err: any) {
    if (err.name === "CastError") {
      return next(new AppError("Invalid ID format", 400));
    }
    next(new AppError(err.message || "Error adding comment", 500));
  }
};

// Get comments
const getCommentsByPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { photoId } = req.params;

    const photoObjectId = new mongoose.Types.ObjectId(photoId);

    const comments = await Comment.find({
      photo: photoObjectId,
      parentComment: null,
    })
      .populate("user", "_id username profile_img_url")
      .sort({ created_at: -1 })
      .lean();

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .sort({ created_at: -1 })
          .populate("user", "_id username profile_img_url")
          .lean();
        return { ...comment, replies };
      })
    );

    res.json({
      message: "Fotoğrafın yorumları başarıyla getirildi.",
      success: true,
      data: commentsWithReplies,
    });
  } catch (err: any) {
    next(new AppError(err.message || "Error fetching comments", 500));
  }
};

// Delete comment
const deleteComment = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return next(new AppError("Comment not found", 404));

    checkOwnershipOrRole(comment.user.toString(), req);

    await comment.deleteOne();

    res.json({ success: true, message: "Comment deleted" });
  } catch (err: any) {
    next(new AppError(err.message || "Error deleting comment", 500));
  }
};

// Update comment
const updateComment = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) return next(new AppError("Comment not found", 404));

    checkOwnershipOrRole(comment.user.toString(), req, ["admin", "moderator"]);

    if (
      comment.edit_count >= 1 &&
      req.user?.role !== "admin" &&
      req.user?.role !== "moderator"
    ) {
      return next(
        new AppError("Bir yorumu sadece bir kez düzenleyebilirsiniz", 403)
      );
    }

    comment.text = text;
    comment.is_edited = true;
    comment.edit_count += 1;

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate("user", "_id username profile_img_url")
      .lean();

    res.json({
      message: "Yorum başarıyla güncellendi.",
      success: true,
      data: updatedComment,
    });
  } catch (err: any) {
    next(new AppError(err.message || "Error updating comment", 500));
  }
};

export { addComment, getCommentsByPhoto, deleteComment, updateComment };
