import jwt from "jsonwebtoken";
import { config } from "../config/config";

const { accessToken, refreshToken } = config.jwt;

export const generateAccessToken = (user: { _id: string; role?: string }) => {
  return jwt.sign(
    { userId: String(user._id), role: user.role },
    accessToken.secret as string,
    { expiresIn: accessToken.expire }
  );
};

export const generateRefreshToken = (user: { _id: string }) => {
  return jwt.sign({ userId: user._id }, refreshToken.secret as string, {
    expiresIn: refreshToken.expire,
  });
};
