import { Router } from "express";
import {
  addComment,
  getCommentsByPhoto,
  deleteComment,
  updateComment,
} from "../controllers/commentController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/:photoId/comments", authenticate, addComment);
router.get("/:photoId/comments", getCommentsByPhoto);
router.delete("/:id/comments/", authenticate, deleteComment);
router.put("/comments/:id", authenticate, updateComment);

export default router;
