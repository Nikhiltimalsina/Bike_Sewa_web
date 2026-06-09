"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constant_1 = require("../configs/constant");
const http_exception_1 = require("../exceptions/http-exception");
const authorizedMiddleware = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new http_exception_1.UnauthorizedException("No token provided");
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, constant_1.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof http_exception_1.UnauthorizedException) {
            next(error);
        }
        else {
            next(new http_exception_1.UnauthorizedException("Invalid or expired token"));
        }
    }
};
exports.default = authorizedMiddleware;
//# sourceMappingURL=authorized.middleware.js.map