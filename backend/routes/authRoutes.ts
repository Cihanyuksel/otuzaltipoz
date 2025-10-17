import { Router } from "express";
import { loginSchema, signupSchema } from "../validators/auth.validator";
import {
  forgotPasswordScheme,
  resetPasswordScheme,
} from "../validators/password.validator";
import upload from "../middleware/multer";
import {
  login,
  logout,
  refresh,
  signup,
  verifyEmail,
} from "../controllers/authController";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgotPasswordController";
import { authenticate } from "../middleware/authMiddleware";
import { verifyEmailScheme } from "../validators/verifyEmail.validator";
import { validate, validateFile } from "../middleware/validate";

const router = Router();

router.post(
  "/signup",
  upload.single("profile_img"),
  validateFile({
    required: false,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
    maxSize: 5 * 1024 * 1024,
  }),
  validate({ body: signupSchema }),
  signup
);
router.post("/login", validate({ body: loginSchema }), login);
router.post("/logout", authenticate, logout);
router.post("/refresh", refresh);

router.post(
  "/forgot-password",
  validate({ body: forgotPasswordScheme }),
  forgotPassword
);
router.post(
  "/reset-password",
  validate({ body: resetPasswordScheme }),
  resetPassword
);
router.get(
  "/verify-email",
  validate({ query: verifyEmailScheme }),
  verifyEmail
);

export default router;
