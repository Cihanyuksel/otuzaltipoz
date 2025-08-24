// routes/commentRoutes.ts
import { Router } from "express";
import { addComment, getCommentsByPhoto, deleteComment, updateComment } from "../controllers/commentController";
import { authenticate } from "../middleware/authMiddleware";
const router = Router();

router.post("/photos/:photoId/comments", authenticate, addComment);
router.get("/photos/:photoId/comments", getCommentsByPhoto);

router.delete("/comments/:id", authenticate, deleteComment);
router.put("/comments/:id", authenticate, updateComment);

export default router;
