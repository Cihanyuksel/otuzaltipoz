import { Router } from "express";
import { getPhotoLikes, likePhoto, unlikePhoto } from "../controllers/likeController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/:photoId/like", authenticate, likePhoto);
router.delete("/:photoId/unlike", authenticate, unlikePhoto);
router.get("/:photoId/likes", getPhotoLikes);

export default router;
