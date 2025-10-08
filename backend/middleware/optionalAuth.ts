import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { config } from "../config/config";
import { IGetUserAuthInfoRequest } from "./restrictTo";

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
      config.jwt.accessToken.secret!
    ) as JwtPayload;

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return next();
    }

    (req as any).user = user;
    next();
  } catch (err) {
    console.log("JWT verify hatası:", err);
    return next();
  }
};
