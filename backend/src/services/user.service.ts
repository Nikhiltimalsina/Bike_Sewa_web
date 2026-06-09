import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository";
import { RegisterDto, LoginDto } from "../dtos/user.dto";
import { IUserSafe, IJwtPayload } from "../types/user.type";
import {
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from "../exceptions/http-exception";
import { JWT_SECRET, JWT_EXPIRES_IN, SALT_ROUNDS } from "../configs/constant";

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
    const safeUser: IUserSafe = {
      _id: newUser._id.toString(),
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    };

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
    const safeUser: IUserSafe = {
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    return { message: "Login successful", token, user: safeUser };
  },
};

export default UserService;
