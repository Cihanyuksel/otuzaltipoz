//project files
import User from "../models/User";
import Token from "../models/Token";
import RefreshToken from "../models/refreshToken";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { generateDeviceId } from "../utils/deviceId";
import { sendVerifyEmail } from "../utils/sendMail";
import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../config/cookieConfig";
import { AppError } from "../utils/AppError";
//third-party
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary";
import { randomBytes } from "crypto";
import { config } from "../config/config";

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
    role?: string;
  };
}

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username, password, full_name } = req.body;

    // Input validation
    if (!email || !username || !password || !full_name) {
      return next(new AppError("Tüm alanlar zorunludur.", 400));
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Geçerli bir email adresi giriniz.", 400));
    }

    // Password strength validation
    if (password.length < 6) {
      return next(new AppError("Şifre en az 6 karakter olmalıdır.", 400));
    }

    // Check existing email and username
    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email: email.toLowerCase() }),
      User.findOne({ username: username.toLowerCase() }),
    ]);

    if (existingEmail) {
      return next(new AppError("Bu email zaten kullanılıyor.", 400));
    }

    if (existingUsername) {
      return next(new AppError("Bu kullanıcı adı zaten alınmış.", 400));
    }

    let profile_img_url: string | undefined;

    // Handle profile image upload
    if (req.file?.buffer) {
      try {
        const uploadResult: any = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "photos_app/profiles",
              transformation: [
                { width: 300, height: 300, crop: "fill", gravity: "face" },
                { quality: "auto", format: "webp" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file!.buffer);
        });
        profile_img_url = uploadResult.secure_url;
      } catch (cloudErr: any) {
        console.error("Cloudinary upload error:", cloudErr);
        return next(
          new AppError("Profil resmi yüklenirken bir hata oluştu.", 500)
        );
      }
    }

    // Create user 
    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      full_name: full_name.trim(),
      role: "user",
      profile_img_url,
      is_active: false,
      is_verified: false,
    });

    // Generate verification token
    const verificationToken = randomBytes(32).toString("hex");

    await Token.create({
      userId: newUser._id,
      token: verificationToken,
      type: "emailVerification",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 saat
    });

    // Send verification email
    try {
      sendVerifyEmail(newUser.email, newUser.username, verificationToken);
    } catch (emailError: any) {
      console.error("Email sending failed:", emailError);
      // User and token delete
      await Promise.all([
        User.findByIdAndDelete(newUser._id),
        Token.deleteOne({ userId: newUser._id, type: "emailVerification" }),
      ]);
      return next(
        new AppError(
          "E-posta gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
          500
        )
      );
    }

    res.status(201).json({
      success: true,
      message:
        "Kayıt başarılı! E-postanı kontrol et ve hesabını aktifleştir.",
      user: {
        id: newUser._id,
        username: newUser.username,
        fullname: newUser.full_name,
        email: newUser.email,
        profile_img_url: newUser.profile_img_url,
        is_active: newUser.is_active,
        role: newUser.role,
        is_verified: newUser.is_verified,
      },
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    next(new AppError(err.message || "Sunucu hatası", 500));
  }
};

// Verify email
const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return next(new AppError("Geçersiz token", 400));
    }

    const tokenDoc = await Token.findOne({
      token,
      type: "emailVerification",
      expiresAt: { $gt: new Date() },
    }).populate("userId");

    
    if (!tokenDoc) {
      return next(
        new AppError(
          "Geçersiz veya süresi dolmuş token. Lütfen tekrar kayıt olun.",
          400
        )
      );
    }

    const user = tokenDoc.userId as any;
    if (!user) {
      return next(new AppError("Kullanıcı bulunamadı", 404));
    }

    if (user.is_verified) {
      await Token.deleteOne({ _id: tokenDoc._id });

      res.status(200).json({
        success: true,
        message: "Bu hesap zaten aktifleştirilmiş. Giriş yapabilirsiniz.",
        redirect: "/login",
      });
      return;
    }

    user.is_verified = true;
    await user.save();

    await Token.deleteOne({ _id: tokenDoc._id });

    res.status(200).json({
      success: true,
      message: "🎉 E-posta başarıyla doğrulandı! Artık giriş yapabilirsin.",
      redirect: "/login",
    });
  } catch (err: any) {
    console.error("❌ Email verification error:", err);
    next(new AppError("Doğrulama başarısız. Lütfen tekrar deneyin.", 500));
  }
};


const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password)
      return next(new AppError("Email ve şifre gereklidir.", 400));

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user)
      return next(
        new AppError("Email veya şifre hatalı. Lütfen tekrar deneyin.", 401)
      );

    // Check if account is activated
    if (!user.is_verified) {
      return next(
        new AppError(
          "Hesabınız henüz aktifleştirilmemiş. Lütfen e-postanızı kontrol edin.",
          401
        )
      );
    }

    const isMatch = await user.comparePassword(password.trim());
    if (!isMatch) {
      return next(
        new AppError("Email veya şifre hatalı. Lütfen tekrar deneyin.", 401)
      );
    }

    user.is_active = true;
    await user.save();

    const userData = {
      id: user._id,
      username: user.username,
      fullname: user.full_name,
      email: user.email,
      role: user.role,
      profile_img_url: user.profile_img_url,
      isActive: user.is_active,
    };

    // Generate tokens
    const accessToken = generateAccessToken({
      _id: user._id as string,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ _id: user._id as string });
    const deviceId = generateDeviceId(req);

    // Save/update refresh token
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

    // Set refresh token cookie
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
    console.error("Login error:", error);
    next(new AppError(error.message || "Server error", 500));
  }
};

//refresh endpoint
const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new AppError("No token provided", 401));
  }

  const deviceId = generateDeviceId(req);
  if (!deviceId) {
    return next(new AppError("Device ID is missing", 401));
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      config.jwt.refreshToken.secret
    ) as JwtPayload;

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      userId: payload.userId,
      deviceId: deviceId,
    });

    if (!storedToken) {
      await RefreshToken.deleteMany({ userId: payload.userId });
      return next(
        new AppError("Invalid refresh token or session revoked", 403)
      );
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

// logout user
const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

export { login, logout, signup, refresh, verifyEmail };

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
