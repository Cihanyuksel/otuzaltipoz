import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import Category from "../models/Categories";

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find()
      .select("_id name")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      status: true,
      total: categories.length,
      data: categories,
    });
  } catch (error: any) {
    next(new AppError(error.message || "Kategoriler getirilemedi", 500));
  }
};
