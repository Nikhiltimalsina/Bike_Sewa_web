export declare class HttpException extends Error {
    statusCode: number;
    message: string;
    constructor(message: string, statusCode: number);
}
export declare class BadRequestException extends HttpException {
    constructor(message: string);
}
export declare class UnauthorizedException extends HttpException {
    constructor(message?: string);
}
export declare class NotFoundException extends HttpException {
    constructor(message?: string);
}
export declare class ConflictException extends HttpException {
    constructor(message?: string);
}
//# sourceMappingURL=http-exception.d.ts.map