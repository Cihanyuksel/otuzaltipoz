import { Router } from "express";
import { getPhotoLikes, toggleLike, } from "../controllers/likeController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/:photoId/like", authenticate, toggleLike);
router.get("/:photoId/likes", authenticate, getPhotoLikes);

export default router;
