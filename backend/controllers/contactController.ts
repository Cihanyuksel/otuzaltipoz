import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { sendContactEmail } from "../utils/sendMail";

interface ContactRequestBody {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
}

export const sendContactMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullName, email, phone, message }: ContactRequestBody = req.body;

    // Input validation
    if (!fullName || !email || !message) {
      return next(
        new AppError("Ad Soyad, E-posta ve Mesaj alanları zorunludur.", 400)
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Geçerli bir e-posta adresi giriniz.", 400));
    }

    // Message length validation
    if (message.trim().length < 10) {
      return next(new AppError("Mesaj en az 10 karakter olmalıdır.", 400));
    }

    if (message.trim().length > 2000) {
      return next(new AppError("Mesaj en fazla 2000 karakter olabilir.", 400));
    }

    // Send contact email
    try {
      await sendContactEmail(fullName.trim(), email, phone?.trim(), message.trim());
    } catch (emailError: any) {
      console.error("Contact email sending failed:", emailError);
      return next(
        new AppError(
          "Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
          500
        )
      );
    }

    res.status(200).json({
      success: true,
      message: "Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.",
    });
  } catch (err: any) {
    console.error("Contact message error:", err);
    next(new AppError(err.message || "Sunucu hatası", 500));
  }
};