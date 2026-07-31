import { Request, Response, NextFunction } from "express";
import UserModel from "../models/user.model";
import UserRepository from "../repositories/user.repository";
import { NotFoundException, BadRequestException } from "../exceptions/http-exception";
import { IUserSafe } from "../types/user.type";

const toSafeUser = (user: any): IUserSafe => ({
  _id: user._id.toString(),
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  avatar: user.avatar || "",
});

const AdminUsersController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserRepository.findAll();
      res.status(200).json({ users: users.map(toSafeUser) });
    } catch (error) {
      next(error);
    }
  },

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req.body;
      if (!role || !["user", "admin"].includes(role)) {
        throw new BadRequestException("Role must be 'user' or 'admin'");
      }
      const user = await UserRepository.findById(req.params.id);
      if (!user) throw new NotFoundException("User not found");
      user.role = role as any;
      await user.save();
      res.status(200).json({ message: "Role updated successfully", user: toSafeUser(user) });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserRepository.findById(req.params.id);
      if (!user) throw new NotFoundException("User not found");
      await UserModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default AdminUsersController;