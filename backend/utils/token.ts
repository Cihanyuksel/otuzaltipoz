import jwt from "jsonwebtoken";
import { authConfig } from "../config/authConfig";

const { accessToken, refreshToken } = authConfig;

export const generateAccessToken = (user: { _id: string; role?: string }) => {
  return jwt.sign(
    { userId: String(user._id), role: user.role },
    accessToken.secret,
    { expiresIn: authConfig.accessToken.expiresIn }
  );
};

export const generateRefreshToken = (user: { _id: string }) => {
  return jwt.sign({ userId: user._id }, refreshToken.secret, {
    expiresIn: authConfig.refreshToken.expiresIn,
  });
};
