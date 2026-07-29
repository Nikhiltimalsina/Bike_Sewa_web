import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import { validateRegisterDto, validateLoginDto, validateUpdateProfileDto } from "../dtos/user.dto";
import { BadRequestException, UnauthorizedException } from "../exceptions/http-exception";

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

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.userId);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fullName, phone, role, email } = req.body;
      const updateData: Partial<{ fullName: string; phone: string; role: string; email: string }> = {};
      if (fullName !== undefined) updateData.fullName = fullName;
      if (phone !== undefined) updateData.phone = phone;
      if (role !== undefined) updateData.role = role;
      if (email !== undefined) updateData.email = email;

      const user = await UserService.updateUser(req.params.userId, updateData);
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await UserService.deleteUser(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role } = req.body;
      const user = await UserService.updateUserRole(req.params.userId, role);
      res.status(200).json({ message: "User role updated successfully", user });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validateRegisterDto(req.body);
      if (errors.length > 0) {
        throw new BadRequestException(errors[0]);
      }

      const result = await UserService.createAdminUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await UserService.getStats();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new BadRequestException("Please provide a valid email address");
      }
      const result = await UserService.forgotPassword({ email });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;
      if (!token) {
        throw new BadRequestException("Reset token is required");
      }
      if (!password || password.length < 8) {
        throw new BadRequestException("Password must be at least 8 characters");
      }
      const result = await UserService.resetPassword({ token, password });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

export default UserController;
