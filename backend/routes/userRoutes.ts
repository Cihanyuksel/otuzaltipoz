import { Router } from "express";
import {
  getAllUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
} from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";
import { restrictTo } from "../middleware/restrictTo";

const router = Router();

router.get("/", authenticate, restrictTo(["admin", "moderator"]), getAllUsers);
router.get("/:id", getUser);
router.post("/", addUser);
router.delete("/:id", authenticate, deleteUser);
router.put("/:id", authenticate, updateUser);

export default router;
