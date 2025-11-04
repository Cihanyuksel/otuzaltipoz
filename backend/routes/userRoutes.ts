import { Router } from "express";
import {
  getAllUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
  updateUsername,
  updatePassword,
} from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";
import { restrictTo } from "../middleware/restrictTo";
import upload from "../middleware/multer";

const router = Router();

router.get("/", authenticate, restrictTo(["admin", "moderator"]), getAllUsers);
router.get("/:id", getUser);
router.post("/", addUser);
router.put("/:id", authenticate, upload.single("profile_img"), updateUser);
router.put("/:id/username", authenticate, updateUsername);
router.put("/:id/password", authenticate, updatePassword);
router.delete("/:id", authenticate, deleteUser);

export default router;
