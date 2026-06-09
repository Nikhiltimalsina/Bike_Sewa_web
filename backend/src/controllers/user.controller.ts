import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import { validateRegisterDto, validateLoginDto } from "../dtos/user.dto";
import { BadRequestException } from "../exceptions/http-exception";

const UserController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate incoming body
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
      // Validate incoming body
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
};

export default UserController;
