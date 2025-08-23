import express from "express";
import { login, logout, refresh, signup } from "../controllers/authController";
import { protectedRoute } from "../controllers/protected";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/protected", protectedRoute);

export default router;
