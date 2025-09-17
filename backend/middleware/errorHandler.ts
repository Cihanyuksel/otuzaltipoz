// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const isAppError = err instanceof AppError;

  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : 'Something went wrong';

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};
