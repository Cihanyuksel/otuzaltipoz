import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken";
import User from "../models/User";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary";
import {
  authConfig,
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../config/authConfig";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { generateDeviceId } from "../utils/deviceId";
import { AppError } from "../utils/AppError";

dotenv.config();

interface JwtPayload {
  userId: string;
  exp: number;
  iat: number;
}

export interface IGetUserAuthInfoRequest extends Request {
  user?: {
    id: string;
    username?: string;
  };
}

// Login endpoint
const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("Email veya şifre hatalı. Lütfen tekrar deneyin.", 401));
    }

    const isMatch = await user.comparePassword(req.body.password.trim());
    if (!isMatch) {
      return next(new AppError("Email veya şifre hatalı. Lütfen tekrar deneyin.", 401));
    }

    const userData = {
      id: user._id,
      username: user.username,
      fullname: user.full_name,
      email: user.email,
      role: user.role,
      profile_img_url: user.profile_img_url,
      isActive: user.is_active,
    };

    const accessToken = generateAccessToken({
      _id: user._id as string,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ _id: user._id as string });
    const deviceId = generateDeviceId(req);

    if (!user.is_active) {
      user.is_active = true;
      await user.save();
    }

    await RefreshToken.findOneAndUpdate(
      { userId: user._id, deviceId },
      {
        token: refreshToken,
        device: req.headers["user-agent"] || "unknown",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        lastUsedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);

    res.json({
      success: true,
      message: "✅ Başarıyla giriş yaptınız. Yönlendiriliyorsunuz…",
      data: {
        user: userData,
        accessToken,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message || "Server error", 500));
  }
};

//refresh endpoint
const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new AppError("No token provided", 401));
  }

  const deviceId = generateDeviceId(req);
  if (!deviceId) {
    return next(new AppError("Device ID is missing", 401));
  }

  try {
    const payload = jwt.verify(refreshToken, authConfig.refreshToken.secret) as JwtPayload;

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      userId: payload.userId,
      deviceId: deviceId,
    });

    if (!storedToken) {
      await RefreshToken.deleteMany({ userId: payload.userId });
      return next(new AppError("Invalid refresh token or session revoked", 403));
    }

    if (storedToken.expiresAt < new Date()) {
      await storedToken.deleteOne();
      return next(new AppError("Token expired", 403));
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const newAccessToken = generateAccessToken({ _id: user._id as string });
    const newRefreshToken = generateRefreshToken({ _id: user._id as string });

    storedToken.token = newRefreshToken;
    storedToken.lastUsedAt = new Date();
    storedToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await storedToken.save();

    res.cookie("refreshToken", newRefreshToken, refreshTokenCookieConfig);

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        username: user.username,
        fullname: user.full_name,
        email: user.email,
        role: user.role,
        profile_img_url: user.profile_img_url,
        is_active: user.is_active,
      },
    });
  } catch (err: any) {
    next(new AppError(err.message || "Token expired or invalid", 403));
  }
};

// signup user
const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, username, password, full_name } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(new AppError("Bu email zaten kullanılıyor.", 400));
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return next(new AppError("Bu kullanıcı adı zaten alınmış.", 400));
    }

    let profile_img_url: string | undefined;

    if (req.file?.buffer) {
      try {
        const uploadResult: any = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "photos_app" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file!.buffer);
        });
        profile_img_url = uploadResult.secure_url;
      } catch (cloudErr: any) {
        return next(new AppError("Profil resmi yüklenirken bir hata oluştu.", 500));
      }
    }

    const newUser = await User.create({
      username,
      email,
      password,
      full_name,
      role: "user",
      profile_img_url,
    });

    res.status(201).json({
      success: true,
      message: "Kayıt başarılı! Hoşgeldin 😊",
      user: {
        id: newUser._id,
        fullname: newUser.full_name,
        email: newUser.email,
        profile_img_url: newUser.profile_img_url,
        is_active: newUser.is_active,
        role: newUser.role,
      },
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    next(new AppError(err.message || "Sunucu hatası", 500));
  }
};

// logout user
const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new AppError("No refresh token provided", 400));
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (storedToken) {
      const user = await User.findById(storedToken.userId);
      if (user) {
        user.is_active = false;
        await user.save();
      }

      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.clearCookie("refreshToken", clearRefreshTokenCookieConfig);

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout error:", error);
    next(new AppError(error.message || "Server error", 500));
  }
};

export { login, logout, signup, refresh };

/*
if (req.file?.buffer) {
      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "photos_app" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });

      profile_img_url = uploadResult.secure_url;
    }
*/
