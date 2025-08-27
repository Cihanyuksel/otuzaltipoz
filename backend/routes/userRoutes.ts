import { Router } from "express";
import { getAllUsers, getUser, addUser, deleteUser, updateUser } from "../controllers/userController";
import { validate } from "../middleware/validate";
import { createUserSchema } from "../validators/userValidator";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.post("/users", validate(createUserSchema), addUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

export default router;
