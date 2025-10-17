import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import { AppError } from "../utils/AppError";

export const globalErrorHandler = (
  err: Error | MulterError | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Sunucu hatası! Lütfen tekrar deneyin.";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  else if (err instanceof MulterError) {
    statusCode = 400;
    
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Dosya boyutu çok büyük! Maksimum 5MB yüklenebilir.";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message = "Çok fazla dosya yüklendi!";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Beklenmeyen dosya alanı!";
    } else {
      message = `Dosya yükleme hatası: ${err.message}`;
    }
  }
  else if (err instanceof Error) {
    message = err.message;
  }

  if (process.env.NODE_ENV === "development") {
    console.log('🔴 Backend Error:', {
      statusCode,
      message,
      stack: err.stack,
    });
    
    return res.status(statusCode).json({
      success: false, 
      message,
      error: err,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false, 
    message,
  });
};