import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import UserRepository from "../repositories/user.repository";
import BikeRepository from "../repositories/bike.repository";
import BookingRepository from "../repositories/booking.repository";
import { RegisterDto, LoginDto, UpdateProfileDto, ForgotPasswordDto, ResetPasswordDto } from "../dtos/user.dto";
import { IUserSafe, IJwtPayload } from "../types/user.type";
import { UserRole } from "../types/user.type";
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
    const existing = await UserRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const newUser = await UserRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const safeUser: IUserSafe = toSafeUser(newUser);

    return { message: "Registration successful", user: safeUser };
  },

  async login(dto: LoginDto): Promise<{ message: string; token: string; user: IUserSafe }> {
    const user = await UserRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException("No account found with this email");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Incorrect password");
    }

    const payload: IJwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

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
    }> = {};

    if (dto.fullName) updateData.fullName = dto.fullName;
    if (dto.phone) updateData.phone = dto.phone;
    if (avatarFileName) updateData.avatar = avatarFileName;

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

  async getAllUsers(): Promise<IUserSafe[]> {
    const users = await UserRepository.findAll();
    return users.map(toSafeUser);
  },

  async getUserById(userId: string): Promise<IUserSafe> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return toSafeUser(user);
  },

  async updateUser(userId: string, dto: Partial<{ fullName: string; phone: string; role: string; email: string }>): Promise<IUserSafe> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updateData: Partial<{ fullName: string; phone: string; role: string; email: string }> = {};
    if (dto.fullName !== undefined) updateData.fullName = dto.fullName;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.role !== undefined) updateData.role = dto.role;
    if (dto.email !== undefined) updateData.email = dto.email;

    const updatedUser = await UserRepository.updateById(userId, updateData as any);
    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
    return toSafeUser(updatedUser);
  },

  async deleteUser(userId: string): Promise<{ message: string }> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    await UserRepository.deleteById(userId);
    return { message: "User deleted successfully" };
  },

  async updateUserRole(userId: string, role: string): Promise<IUserSafe> {
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestException("Invalid role");
    }
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const updatedUser = await UserRepository.updateById(userId, { role });
    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
    return toSafeUser(updatedUser);
  },

  async createAdminUser(dto: RegisterDto): Promise<{ message: string; user: IUserSafe }> {
    const existing = await UserRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const newUser = await UserRepository.create({
      ...dto,
      password: hashedPassword,
      role: dto.role || UserRole.USER,
    });

    const safeUser: IUserSafe = toSafeUser(newUser);

    return { message: "User created successfully", user: safeUser };
  },

  async getStats(): Promise<{ totalUsers: number; totalBikes: number; totalBookings: number }> {
    const totalUsers = await UserRepository.countDocuments();
    const totalBikes = await BikeRepository.countDocuments();
    const totalBookings = await BookingRepository.countDocuments();

    return { totalUsers, totalBikes, totalBookings };
  },

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await UserRepository.findByEmail(dto.email);
    if (!user) {
      // Don't reveal whether email exists for security
      return { message: "If an account with that email exists, a password reset link has been sent." };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await UserRepository.updateById(user._id.toString(), {
      resetPasswordToken,
      resetPasswordExpires,
    } as any);

    // In a production app, send email with reset link containing the raw token
    // For now, return the token in the response so it can be used via API
    return {
      message: `If an account with that email exists, a password reset link has been sent.`,
      // Include resetToken for development/testing purposes (would normally be in email)
      ...(process.env.NODE_ENV !== "production" ? { resetToken } : {}),
    } as any;
  },

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const hashedToken = crypto.createHash("sha256").update(dto.token).digest("hex");
    const user = await UserRepository.findByResetToken(hashedToken);

    if (!user) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    if (!dto.password || dto.password.length < 8) {
      throw new BadRequestException("Password must be at least 8 characters");
    }

    if (!/[A-Z]/.test(dto.password)) {
      throw new BadRequestException("Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(dto.password)) {
      throw new BadRequestException("Password must contain at least one number");
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    await UserRepository.updateById(user._id.toString(), {
      password: hashedPassword,
      resetPasswordToken: undefined as any,
      resetPasswordExpires: undefined as any,
    });

    return { message: "Password has been reset successfully" };
  },
};

export default UserService;