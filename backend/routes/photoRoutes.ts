import { Router } from "express";
import { getAllPhotos, getPhoto, uploadPhoto, deletePhoto, updatePhoto } from "../controllers/photoController";
import upload from "../middleware/multer";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/photos", getAllPhotos);
router.get("/photos/:id", getPhoto);
router.post("/upload", upload.single("photo"), authenticate, uploadPhoto);
router.delete("/photos/:id", deletePhoto);
router.put("/photos/:id", updatePhoto);

export default router;
