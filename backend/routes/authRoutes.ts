import express from "express";
import {
  login,
  logout,
  refresh,
  signup,
  verifyEmail,
} from "../controllers/authController";
import { protectedRoute } from "../controllers/protected";
import upload from "../middleware/multer";

const router = express.Router();

router.post("/login", login);
router.post("/signup", upload.single("profile_img"), signup);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/protected", protectedRoute);
router.get("/verify-email", verifyEmail);

export default router;
