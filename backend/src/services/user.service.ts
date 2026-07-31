import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import UserRepository from "../repositories/user.repository";
import { RegisterDto, LoginDto, UpdateProfileDto, ForgotPasswordDto, ResetPasswordDto } from "../dtos/user.dto";
import { IUserSafe, IJwtPayload } from "../types/user.type";
import {
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from "../exceptions/http-exception";
import { JWT_SECRET, JWT_EXPIRES_IN, SALT_ROUNDS } from "../configs/constant";

const toSafeUser = (user: {
  _id: { toString(): string };
  fullName: string;
  email: string;
  phone: string;
  role: IUserSafe["role"];
  avatar?: string;
}): IUserSafe => ({
  _id: user._id.toString(),
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  avatar: user.avatar || "",
});

const UserService = {
  async register(dto: RegisterDto): Promise<{ message: string; user: IUserSafe }> {
    // 1. Check for duplicate email
    const existing = await UserRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("An account with this email already exists");
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // 3. Create user in DB
    const newUser = await UserRepository.create({
      ...dto,
      password: hashedPassword,
    });

    // 4. Return safe user (no password)
    const safeUser: IUserSafe = toSafeUser(newUser);

    return { message: "Registration successful", user: safeUser };
  },

  async login(dto: LoginDto): Promise<{ message: string; token: string; user: IUserSafe }> {
    // 1. Find user by email
    const user = await UserRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException("No account found with this email");
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Incorrect password");
    }

    // 3. Sign JWT
    const payload: IJwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    // 4. Return token + safe user
    const safeUser: IUserSafe = toSafeUser(user);

    return { message: "Login successful", token, user: safeUser };
  },

  async getProfile(userId: string): Promise<IUserSafe> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return toSafeUser(user);
  },

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    avatarFileName?: string
  ): Promise<{ message: string; user: IUserSafe }> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updateData: Partial<{
      fullName: string;
      phone: string;
      password: string;
      avatar: string;
      twoFactorEnabled: boolean;
    }> = {};

    if (dto.fullName) updateData.fullName = dto.fullName;
    if (dto.phone) updateData.phone = dto.phone;
    if (avatarFileName) updateData.avatar = avatarFileName;
    if (dto.twoFactorEnabled !== undefined) updateData.twoFactorEnabled = dto.twoFactorEnabled;

    // Handle password change
    if (dto.currentPassword || dto.newPassword) {
      if (!dto.currentPassword || !dto.newPassword) {
        throw new BadRequestException(
          "Both current and new password are required to change password"
        );
      }

      const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
      if (!isMatch) {
        throw new UnauthorizedException("Current password is incorrect");
      }

      updateData.password = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    }

    const updatedUser = await UserRepository.updateById(userId, updateData);
    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    return { message: "Profile updated successfully", user: toSafeUser(updatedUser) };
  },

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string; resetToken: string }> {
    const user = await UserRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException("No account found with this email");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000);

    await UserRepository.updateById(user._id.toString(), {
      resetPasswordToken: resetToken,
      resetPasswordExpires: expires,
    });

    return {
      message: "Password reset token generated",
      resetToken,
    };
  },

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await UserRepository.findByResetToken(dto.token);
    if (!user) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException("Reset token has expired");
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    await UserRepository.updateById(user._id.toString(), {
      password: hashedPassword,
      resetPasswordToken: "",
      resetPasswordExpires: new Date(),
    });

    return { message: "Password has been reset successfully" };
  },

  async countAll(): Promise<number> {
    return UserRepository.count();
  },
};

export default UserService;