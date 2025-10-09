import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const generateAccessToken = (user: { _id: string; role?: string }) => {
  return jwt.sign(
    { userId: String(user._id), role: user.role },
    config.jwt.accessToken.secret,
    { expiresIn: config.jwt.accessToken.expire }
  );
};

export const generateRefreshToken = (user: { _id: string }) => {
  return jwt.sign(
    { userId: user._id },
    config.jwt.refreshToken.secret as string,
    {
      expiresIn: config.jwt.refreshToken.expire,
    }
  );
};
