import { Router } from "express";
import {
  getAllPhotos,
  getPhoto,
  createPhoto,
  deletePhoto,
  updatePhoto,
  getPhotoByUserId,
  getLikedPhotos,
  getPopularPhotos,
} from "../controllers/photoController";
import upload from "../middleware/multer";
import { authenticate } from "../middleware/authMiddleware";
import { authenticateOptional } from "../middleware/optionalAuth";

const router = Router();

router.get("/photos", authenticateOptional, getAllPhotos);
router.get("/photos/popular", getPopularPhotos);
router.get("/photos/liked/:userId", authenticateOptional, getLikedPhotos);
router.get("/photos/user/:userId", authenticateOptional, getPhotoByUserId);
router.get("/photos/:id", getPhoto);
router.post(
  "/photos/upload",
  authenticate,
  upload.single("photo"),
  createPhoto
);
router.delete("/photos/:id", authenticate, deletePhoto);
router.put("/photos/:id", authenticate, updatePhoto);

export default router;
