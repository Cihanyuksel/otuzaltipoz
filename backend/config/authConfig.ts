import dotenv from "dotenv";
import { CookieOptions } from "express";

dotenv.config();

const oneHourInSeconds = 1 * 60 * 60; 
const sevenDaysInSeconds = 7 * 24 * 60 * 60; 

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined.");
  }

// JWT ayarları
export const authConfig = {
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET as string,
    expiresIn: oneHourInSeconds, 
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET as string,
    expiresIn: sevenDaysInSeconds,
  },
};

// Cookie ayarları
export const refreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: sevenDaysInSeconds,
};

export const clearRefreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};
