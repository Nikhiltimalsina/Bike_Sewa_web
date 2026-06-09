"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const UserRepository = {
    async findByEmail(email) {
        return user_model_1.default.findOne({ email: email.toLowerCase() });
    },
    async findById(id) {
        return user_model_1.default.findById(id);
    },
    async create(data) {
        return user_model_1.default.create({
            fullName: data.fullName,
            email: data.email.toLowerCase(),
            phone: data.phone,
            password: data.password,
        });
    },
    async findAll() {
        return user_model_1.default.find().select("-password");
    },
};
exports.default = UserRepository;
//# sourceMappingURL=user.repository.js.map