import { Router } from "express";
import { ratePhoto, getPhotoRatings } from "../controllers/ratingController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/:photoId/rate", authenticate, ratePhoto);
router.get("/:photoId/ratings", getPhotoRatings);

export default router;
