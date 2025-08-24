import { Request, Response } from "express";
import Comment from "../models/Comment";


export interface IGetUserAuthInfoRequest extends Request {
    user?: {
        id: string;
        username?: string;
    }
  }

const addComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
        const {photoId} = req.params;
        const { text} = req.body;
        const comment = await Comment.create({
            text: text,
            photo: photoId,
            user: req.user!.id
        })
        res.status(201).json(comment)
    } 
    
    catch (err) {
        res.status(500).json({ message: "Error adding comment", error: err });
    }
}

const getCommentsByPhoto = async (req: Request, res: Response) => {
    try {
      const { photoId } = req.params;
      const comments = await Comment.find({ photo: photoId }).populate("user", "username");
      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: "Error fetching comments", error: err });
    }
  };

const deleteComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const comment = await Comment.findById(req.params.id);
  
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      // sadece kendi yorumunu silebilsin
      if (comment.user.toString() !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
  
      await comment.deleteOne();
      res.json({ message: "Comment deleted" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting comment", error: err });
    }
  };

  const updateComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const { text } = req.body;
      const comment = await Comment.findById(req.params.id);
  
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      if (comment.user.toString() !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
  
      comment.text = text;
      await comment.save();
  
      res.json(comment);
    } catch (err) {
      res.status(500).json({ message: "Error updating comment", error: err });
    }
  };


  export {
    addComment,
    getCommentsByPhoto,
    deleteComment,
    updateComment
  }