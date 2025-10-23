import { Request, Response, NextFunction } from "express";
import Comment from "../models/Comment";
import { IGetUserAuthInfoRequest } from "./authController";
import { AppError } from "../utils/AppError";
import { checkOwnershipOrRole } from "../utils/authorization";

// Add comment
const addComment = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { photoId } = req.params;
    const { text, parentComment } = req.body;

    const comment = await Comment.create({
      text,
      photo: photoId,
      user: req.user?.id,
      parentComment: parentComment || null,
    });

    res.status(201).json(comment);
  } catch (err: any) {
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

    const comments = await Comment.find({ photo: photoId, parentComment: null })
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
    res.json(commentsWithReplies);
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

    res.json({ message: "Comment deleted" });
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

    if (comment.edit_count >= 1 && req.user?.role !== "admin" && req.user?.role !== "moderator") {
      return next(new AppError("Bir yorumu sadece bir kez düzenleyebilirsiniz", 403));
    }

    comment.text = text;
    comment.is_edited = true;
    comment.edit_count += 1;
    
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate("user", "_id username profile_img_url")
      .lean();

    res.json(updatedComment);
  } catch (err: any) {
    next(new AppError(err.message || "Error updating comment", 500));
  }
};

export { addComment, getCommentsByPhoto, deleteComment, updateComment };
