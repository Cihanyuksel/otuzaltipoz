import { Router } from "express";
import { getAllCategories } from "../controllers/categoriesController";

const router = Router();
router.get("/", getAllCategories);

export default router;
