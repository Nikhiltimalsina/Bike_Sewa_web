"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const http_exception_1 = require("../exceptions/http-exception");
const constant_1 = require("../configs/constant");
const UserService = {
    async register(dto) {
        // 1. Check for duplicate email
        const existing = await user_repository_1.default.findByEmail(dto.email);
        if (existing) {
            throw new http_exception_1.ConflictException("An account with this email already exists");
        }
        // 2. Hash the password
        const hashedPassword = await bcryptjs_1.default.hash(dto.password, constant_1.SALT_ROUNDS);
        // 3. Create user in DB
        const newUser = await user_repository_1.default.create({
            ...dto,
            password: hashedPassword,
        });
        // 4. Return safe user (no password)
        const safeUser = {
            _id: newUser._id.toString(),
            fullName: newUser.fullName,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
        };
        return { message: "Registration successful", user: safeUser };
    },
    async login(dto) {
        // 1. Find user by email
        const user = await user_repository_1.default.findByEmail(dto.email);
        if (!user) {
            throw new http_exception_1.NotFoundException("No account found with this email");
        }
        // 2. Verify password
        const isMatch = await bcryptjs_1.default.compare(dto.password, user.password);
        if (!isMatch) {
            throw new http_exception_1.UnauthorizedException("Incorrect password");
        }
        // 3. Sign JWT
        const payload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, constant_1.JWT_SECRET, {
            expiresIn: constant_1.JWT_EXPIRES_IN,
        });
        // 4. Return token + safe user
        const safeUser = {
            _id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };
        return { message: "Login successful", token, user: safeUser };
    },
};
exports.default = UserService;
//# sourceMappingURL=user.service.js.map