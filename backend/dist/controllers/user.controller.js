"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user.service"));
const user_dto_1 = require("../dtos/user.dto");
const http_exception_1 = require("../exceptions/http-exception");
const UserController = {
    async register(req, res, next) {
        try {
            // Validate incoming body
            const errors = (0, user_dto_1.validateRegisterDto)(req.body);
            if (errors.length > 0) {
                throw new http_exception_1.BadRequestException(errors[0]);
            }
            const result = await user_service_1.default.register(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            // Validate incoming body
            const errors = (0, user_dto_1.validateLoginDto)(req.body);
            if (errors.length > 0) {
                throw new http_exception_1.BadRequestException(errors[0]);
            }
            const result = await user_service_1.default.login(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
};
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map