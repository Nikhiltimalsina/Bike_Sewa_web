"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_ORIGINS = exports.SALT_ROUNDS = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.MONGO_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 3000;
exports.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bike_sewa";
exports.JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
exports.SALT_ROUNDS = 10;
exports.CORS_ORIGINS = [
    "http://localhost:3001",
    "http://localhost:3000",
];
//# sourceMappingURL=constant.js.map