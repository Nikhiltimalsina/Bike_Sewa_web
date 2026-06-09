"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, statusCode = 200) => {
    return res.status(statusCode).json(data);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({ message });
};
exports.sendError = sendError;
//# sourceMappingURL=apihelper.util.js.map