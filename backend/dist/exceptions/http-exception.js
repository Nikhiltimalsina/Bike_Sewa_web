"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictException = exports.NotFoundException = exports.UnauthorizedException = exports.BadRequestException = exports.HttpException = void 0;
class HttpException extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpException.prototype);
    }
}
exports.HttpException = HttpException;
class BadRequestException extends HttpException {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends HttpException {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class NotFoundException extends HttpException {
    constructor(message = "Not found") {
        super(message, 404);
    }
}
exports.NotFoundException = NotFoundException;
class ConflictException extends HttpException {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}
exports.ConflictException = ConflictException;
//# sourceMappingURL=http-exception.js.map