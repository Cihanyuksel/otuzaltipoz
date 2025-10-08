import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AppError } from "../utils/AppError";
import { config } from "../config/config";
import { IGetUserAuthInfoRequest } from "./restrictTo";

interface JwtPayload {
  userId: string;
}

export const authenticate = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new AppError("Bu işleme erişim için geçerli bir token gereklidir.", 401)
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      config.jwt.accessToken.secret!
    ) as JwtPayload;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new AppError("Bu token'a ait kullanıcı bulunamadı.", 401));
    }

    (req as any).user = user;
    next();
  } catch (err) {
    return next(new AppError("Geçersiz veya süresi dolmuş token.", 401));
  }
};
