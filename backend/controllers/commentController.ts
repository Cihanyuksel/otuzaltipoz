import { Request, Response, NextFunction } from "express";
import Comment from "../models/Comment";
import { IGetUserAuthInfoRequest } from "./authController";
import { AppError } from "../utils/AppError";

// Add comment
const addComment = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  try {
    const { photoId } = req.params;
    const { text } = req.body;

    const comment = await Comment.create({
      text,
      photo: photoId,
      user: req.user?.id
    });

    res.status(201).json(comment);
  } catch (err: any) {
    next(new AppError(err.message || "Error adding comment", 500));
  }
};

// Get comments by photo
const getCommentsByPhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { photoId } = req.params;
    const comments = await Comment.find({ photo: photoId }).populate("user", "username");
    res.json(comments);
  } catch (err: any) {
    next(new AppError(err.message || "Error fetching comments", 500));
  }
};

// Delete comment
const deleteComment = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return next(new AppError("Comment not found", 404));
    if (comment.user.toString() !== req.user!.id) return next(new AppError("Not authorized", 403));

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err: any) {
    next(new AppError(err.message || "Error deleting comment", 500));
  }
};

// Update comment
const updateComment = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) return next(new AppError("Comment not found", 404));
    if (comment.user.toString() !== req.user!.id) return next(new AppError("Not authorized", 403));

    comment.text = text;
    await comment.save();

    res.json(comment);
  } catch (err: any) {
    next(new AppError(err.message || "Error updating comment", 500));
  }
};

export { addComment, getCommentsByPhoto, deleteComment, updateComment };
