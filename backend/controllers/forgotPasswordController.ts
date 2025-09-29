import User from "../models/User";
import Token from "../models/Token";
import { NextFunction, Request, Response } from "express";
import { sendResetEmail } from "../utils/sendMail";
import { AppError } from "../utils/AppError";
import { randomBytes } from "crypto";

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    // Email validation
    if (!email) {
      return next(new AppError("Email adresi gereklidir.", 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Geçerli bir email adresi giriniz.", 400));
    }

    // find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(200).json({
        success: true,
        message: "Eğer bu email kayıtlıysa, şifre sıfırlama linki gönderildi.",
      });
      return;
    }

    if (!user.is_verified) {
      return next(
        new AppError(
          "Hesabınız henüz aktifleştirilmemiş. Önce email doğrulaması yapmalısınız.",
          403
        )
      );
    }

    await Token.deleteMany({
      userId: user._id,
      type: "passwordReset",
    });

    const resetToken = randomBytes(32).toString("hex");

    await Token.create({
      userId: user._id,
      token: resetToken,
      type: "passwordReset",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 saat
    });

    // send reset mail
    try {
      sendResetEmail(user.email, resetToken, user.username);
    } catch (emailError: any) {
      console.error("Email sending failed:", emailError);
      // delete token
      await Token.deleteOne({ token: resetToken, type: "passwordReset" });
      return next(
        new AppError(
          "E-posta gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
          500
        )
      );
    }

    res.status(200).json({
      success: true,
      message: "Eğer bu email kayıtlıysa, şifre sıfırlama linki gönderildi.",
    });
  } catch (err: any) {
    console.error("Forgot password error:", err);
    next(new AppError(err.message || "Sunucu hatası", 500));
  }
};


export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
   
    if (!token || !newPassword) {
      return next(new AppError("Token ve yeni şifre gereklidir.", 400));
    }

    if (newPassword.length < 6) {
      return next(new AppError("Şifre en az 6 karakter olmalıdır.", 400));
    }

    // find token
    const tokenDoc = await Token.findOne({
      token,
      type: "passwordReset",
      expiresAt: { $gt: new Date() },
    }).populate("userId");

    if (!tokenDoc) {
      return next(
        new AppError(
          "Geçersiz veya süresi dolmuş token. Lütfen tekrar şifre sıfırlama isteği gönderin.",
          400
        )
      );
    }

    const user = tokenDoc.userId as any;
    if (!user) {
      return next(new AppError("Kullanıcı bulunamadı.", 404));
    }

    // save new passowrd
    user.password = newPassword.trim();
    await user.save();

    //delete password
    await Token.deleteOne({ _id: tokenDoc._id });

    const RefreshToken = (await import("../models/refreshToken")).default;
    await RefreshToken.deleteMany({ userId: user._id });

    res.status(200).json({
      success: true,
      message: "✅ Şifreniz başarıyla değiştirildi. Artık giriş yapabilirsiniz.",
      redirect: "/login",
    });
  } catch (err: any) {
    console.error("Reset password error:", err);
    next(new AppError(err.message || "Sunucu hatası", 500));
  }
};