export class HttpException extends Error {
  public statusCode: number;
  public message: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = "Not found") {
    super(message, 404);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}
