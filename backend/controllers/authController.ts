import { CookieOptions, Request, Response } from "express";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken";
import User from "../models/User";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";


dotenv.config(); 

interface JwtPayload {
  userId: string;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Cookie settings
const refreshTokenCookieConfig :CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 
};

const clearRefreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
}

// Login endpoint
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.body.email});
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Access token
    const accessToken = jwt.sign( { userId: user._id }, ACCESS_TOKEN_SECRET as string, { expiresIn: "1m" });
    // Refresh token
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET as string, { expiresIn: "30s" });

    // Save to DB
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      device: req.headers["user-agent"] || "unknown",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Add to cookie
    res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);

    // Send access token via JSON
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Refresh endpoint
export const refresh = async (req: Request, res: Response): Promise<Response> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ msg: "No token provided" });

  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken) return res.status(401).json({ msg: "Invalid refresh token" });

  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET!) as JwtPayload;
    const user = await User.findById(payload.userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    const newAccessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });

    // Create a new refresh token and update the cookie
    const newRefreshToken = jwt.sign( { userId: user._id }, REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });

    await RefreshToken.findByIdAndUpdate(storedToken._id, { token: newRefreshToken });

    res.cookie("refreshToken", newRefreshToken, refreshTokenCookieConfig);

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ msg: "Token expired or invalid" });
  }
};


// signup user
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, full_name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      full_name,
      role: "user",
      is_active: true,
    });

    res.status(201).json({ msg: "User created", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(400).json({ message: "No refresh token provided" });
      return;
    }

    // delete token from db
    await RefreshToken.deleteOne({ token: refreshToken });

    // delete from cookie
    res.clearCookie("refreshToken", clearRefreshTokenCookieConfig);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};