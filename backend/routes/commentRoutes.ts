import { Router } from "express";
import {
  addComment,
  getCommentsByPhoto,
  deleteComment,
  updateComment,
} from "../controllers/commentController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/:photoId", getCommentsByPhoto);  
router.post("/:photoId", authenticate, addComment);  

router.put("/:id", authenticate, updateComment);  
router.delete("/:id", authenticate, deleteComment)

export default router;
