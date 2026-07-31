import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import BikeModel from "../models/bike.model";
import BookingModel from "../models/booking.model";
import { validateRegisterDto, validateLoginDto, validateUpdateProfileDto, validateForgotPasswordDto, validateResetPasswordDto } from "../dtos/user.dto";
import { BadRequestException, UnauthorizedException, NotFoundException } from "../exceptions/http-exception";

const UserController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validateRegisterDto(req.body);
      if (errors.length > 0) {
        throw new BadRequestException(errors[0]);
      }

      const result = await UserService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validateLoginDto(req.body);
      if (errors.length > 0) {
        throw new BadRequestException(errors[0]);
      }

      const result = await UserService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async whoami(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedException("Not authenticated");
      }

      const user = await UserService.getProfile(req.user.userId);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedException("Not authenticated");
      }

      const errors = validateUpdateProfileDto(req.body);
      if (errors.length > 0) {
        throw new BadRequestException(errors[0]);
      }

      const avatarFileName = req.file ? req.file.filename : undefined;

      const result = await UserService.updateProfile(
        req.user.userId,
        req.body,
        avatarFileName
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validateForgotPasswordDto(req.body);
      if (errors.length > 0) {
        throw new BadRequestException(errors[0]);
      }

      const result = await UserService.forgotPassword(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validateResetPasswordDto(req.body);
      if (errors.length > 0) {
        throw new BadRequestException(errors[0]);
      }

      const result = await UserService.resetPassword(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [totalUsers, totalBikes, totalBookings] = await Promise.all([
        UserService.countAll(),
        BikeModel.countDocuments(),
        BookingModel.countDocuments(),
      ]);
      res.status(200).json({ totalUsers, totalBikes, totalBookings });
    } catch (error) {
      next(error);
    }
  },
};

export default UserController;