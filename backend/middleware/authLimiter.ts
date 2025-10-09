import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { AppError } from "../utils/AppError";

const createLimiter = ({
  windowMs,
  max,
  message,
}: {
  windowMs: number;
  max: number;
  message: string;
}) =>
  rateLimit({
    windowMs,
    max,
    message,
    statusCode: 429,
    handler: (req: Request, res: Response, next: NextFunction) =>
      next(new AppError(message, 429)),
    standardHeaders: true,
    legacyHeaders: false,
  });

export const maxLoginRotations = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Çok fazla giriş denemesi yaptınız. Lütfen 15 dakika sonra tekrar deneyin.",
});

export const maxRefreshTokenRotations = createLimiter({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Çok fazla token yenileme denemesi yaptınız. Lütfen biraz sonra tekrar deneyin.",
});

export const maxForgetPasswordRotations = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Bu işlem için çok fazla deneme yaptınız. Lütfen bir saat sonra tekrar deneyin.",
});

export const maxContactRotations = createLimiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  message: "Günlük iletişim mesajı limitine ulaşıldı. Lütfen yarın tekrar deneyin.",

})