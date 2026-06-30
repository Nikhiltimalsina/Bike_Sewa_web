import { Request, Response, NextFunction } from "express";
import { IJwtPayload, UserRole } from "../types/user.type";
import { ForbiddenException } from "../exceptions/http-exception";

const adminMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // User must be authenticated (authorizedMiddleware should run first)
  const user = req.user as IJwtPayload | undefined;
  if (user && user.role !== UserRole.ADMIN) {
    return next(new ForbiddenException("Admin access required"));
  }
  next();
};

export default adminMiddleware;