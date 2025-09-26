import dotenv from "dotenv";
import { CookieOptions } from "express";

dotenv.config();

const sevenDaysInSeconds = 7 * 24 * 60 * 60;

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error(
    "ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined."
  );
}

// Cookie settings
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
