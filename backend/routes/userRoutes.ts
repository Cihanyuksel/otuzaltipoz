import { Router } from "express";
import {
  getAllUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
} from "../controllers/userController";
import { validate } from "../middleware/validate";
import { createUserSchema } from "../validators/userValidator";
import { authenticate } from "../middleware/authMiddleware";
import { restrictTo } from "../middleware/restrictTo";

const router = Router();

router.get("/users", authenticate, restrictTo(["admin"]), getAllUsers);
router.get("/users/:id", getUser);
router.post("/users", validate(createUserSchema), addUser);
router.delete("/users/:id", authenticate, deleteUser);
router.put("/users/:id", authenticate, updateUser);

export default router;
