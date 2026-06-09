"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginDto = exports.validateRegisterDto = void 0;
// Validation helpers (mirrors Zod on frontend)
const validateRegisterDto = (body) => {
    const errors = [];
    if (!body.fullName || body.fullName.trim().length < 2)
        errors.push("Full name must be at least 2 characters");
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
        errors.push("Please provide a valid email address");
    if (!body.phone || !/^[0-9]{10}$/.test(body.phone))
        errors.push("Phone number must be exactly 10 digits");
    if (!body.password || body.password.length < 8)
        errors.push("Password must be at least 8 characters");
    if (body.password && !/[A-Z]/.test(body.password))
        errors.push("Password must contain at least one uppercase letter");
    if (body.password && !/[0-9]/.test(body.password))
        errors.push("Password must contain at least one number");
    return errors;
};
exports.validateRegisterDto = validateRegisterDto;
const validateLoginDto = (body) => {
    const errors = [];
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
        errors.push("Please provide a valid email address");
    if (!body.password || body.password.trim().length === 0)
        errors.push("Password is required");
    return errors;
};
exports.validateLoginDto = validateLoginDto;
//# sourceMappingURL=user.dto.js.map