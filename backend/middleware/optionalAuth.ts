// authController.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { IGetUserAuthInfoRequest } from "../controllers/authController";

interface JwtPayload {
  userId: string;
}

export const authenticateOptional = async (
  req: IGetUserAuthInfoRequest, 
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return next();
    }

    (req as any).user = user;

    next();
  } catch (err) {
    return next();
  }
};