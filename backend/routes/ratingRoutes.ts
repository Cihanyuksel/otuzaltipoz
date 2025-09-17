import { Router } from "express";
import { ratePhoto, getPhotoRatings } from "../controllers/ratingController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/photos/:photoId/rate", authenticate, ratePhoto);
router.get("/photos/:photoId/ratings", getPhotoRatings);

export default router;
