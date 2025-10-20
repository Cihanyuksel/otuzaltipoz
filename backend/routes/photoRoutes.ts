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
import {
  getAllPhotosQuerySchema,
  getPopularPhotosQuerySchema,
  photoIdParamsSchema,
  userIdParamsSchema,
  createPhotoSchema,
  updatePhotoSchema,
} from "../validators/photo.validator";
import upload from "../middleware/multer";
import { authenticate } from "../middleware/authMiddleware";
import { authenticateOptional } from "../middleware/optionalAuth";
import { validate, validateFile } from "../middleware/validate";

const router = Router();

router.get(
  "/",
  authenticateOptional,
  validate({ query: getAllPhotosQuerySchema }),
  getAllPhotos
);

router.get(
  "/popular",
  validate({ query: getPopularPhotosQuerySchema }),
  getPopularPhotos
);

router.get(
  "/liked/:userId",
  authenticateOptional,
  validate({ params: userIdParamsSchema }),
  getLikedPhotos
);

router.get(
  "/user/:userId",
  authenticateOptional,
  validate({ params: userIdParamsSchema }),
  getPhotoByUserId
);

router.get("/:id", validate({ params: photoIdParamsSchema }), getPhoto);

router.post(
  "/upload",
  authenticate,
  upload.single("photo"),
  validateFile({
    required: true,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
    maxSize: 5 * 1024 * 1024,
  }),
  validate({ body: createPhotoSchema }),
  createPhoto
);

router.put(
  "/:id",
  authenticate,
  validate({
    params: photoIdParamsSchema,
    body: updatePhotoSchema,
  }),
  updatePhoto
);

router.delete(
  "/:id",
  authenticate,
  validate({ params: photoIdParamsSchema }),
  deletePhoto
);

export default router;
