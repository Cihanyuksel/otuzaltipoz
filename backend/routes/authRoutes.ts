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
import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgotPasswordController";
import { sendContactMessage } from "../controllers/contactController";

const router = express.Router();

router.post("/login", login);
router.post("/signup", upload.single("profile_img"), signup);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/protected", protectedRoute);
router.get("/verify-email", verifyEmail);

// password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// contact form route
router.post("/contact", sendContactMessage);

export default router;
