import dotenv from "dotenv";
import { CookieOptions } from "express";
import { config } from "./config";

dotenv.config();

const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
const isProduction = config.node_env === "production";

if (!config.jwt.accessToken.secret || !config.jwt.refreshToken.secret) {
  throw new Error(
    "ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined."
  );
}

export const refreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  maxAge: sevenDaysInMilliseconds,
  path: "/",
};

export const clearRefreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  path: "/",
};
