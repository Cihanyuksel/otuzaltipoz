import { Response, NextFunction, Request } from "express";
import { AppError } from "../utils/AppError";

export interface IGetUserAuthInfoRequest extends Request {
  user?: {
    id: string;
    username?: string;
    role?: string;
  };
}

export const restrictTo = (allowedRoles: string[]) => {
  return (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Bu işleme erişim yetkiniz yoktur.", 403));
    }

    const userRole: string = req.user.role || "";

    if (!allowedRoles.includes(userRole)) {
      return next(new AppError("Bu işleme erişim yetkiniz yoktur.", 403));
    }

    next();
  };
};
