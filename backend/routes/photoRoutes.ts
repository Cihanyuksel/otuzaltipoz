import { Router } from "express";
import { getAllPhotos, getPhoto, uploadPhoto, deletePhoto, updatePhoto } from "../controllers/photoController";
import upload from "../middleware/multer";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/photos", getAllPhotos);
router.get("/photos/:id", getPhoto);
router.post("/photos/upload", authenticate, upload.single("photo"),  uploadPhoto);
router.delete("/photos/:id", authenticate, deletePhoto);
router.put("/photos/:id", authenticate, updatePhoto);

export default router;
