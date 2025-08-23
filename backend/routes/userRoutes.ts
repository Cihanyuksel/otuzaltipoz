import { Router } from "express";
import { getAllUsers, getUser, addUser, deleteUser, updateUser } from "../controllers/userController";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.post("/users", addUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

export default router;
