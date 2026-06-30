import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/constant";
import { IJwtPayload } from "../types/user.type";
import { UnauthorizedException } from "../exceptions/http-exception";

// Extend Express Request to include user and file from multer
declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

const authorizedMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as IJwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      next(error);
    } else {
      next(new UnauthorizedException("Invalid or expired token"));
    }
  }
};

export default authorizedMiddleware;
