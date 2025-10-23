// utils/authorization.ts
import { IGetUserAuthInfoRequest } from "../controllers/authController";
import { AppError } from "../utils/AppError";

export const checkOwnershipOrRole = (
  resourceUserId: string,
  req: IGetUserAuthInfoRequest,
  allowedRoles: string[] = ["admin", "moderator"]
) => {
  if (resourceUserId !== req.user?.id && !allowedRoles.includes(req.user?.role || "")) {
    throw new AppError("Bu işlemi yapmaya yetkiniz yok", 403);
  }
};
