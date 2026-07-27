import { describe, it, expect } from 'vitest';
import {
  HttpException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '../http-exception';

describe('HttpException', () => {
  it('should create base HttpException', () => {
    const error = new HttpException('Test error', 400);
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
  });

  it('should create BadRequestException', () => {
    const error = new BadRequestException('Bad request');
    expect(error.message).toBe('Bad request');
    expect(error.statusCode).toBe(400);
  });

  it('should create UnauthorizedException', () => {
    const error = new UnauthorizedException('Unauthorized');
    expect(error.message).toBe('Unauthorized');
    expect(error.statusCode).toBe(401);
  });

  it('should create NotFoundException', () => {
    const error = new NotFoundException('Not found');
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
  });

  it('should create ConflictException', () => {
    const error = new ConflictException('Conflict');
    expect(error.message).toBe('Conflict');
    expect(error.statusCode).toBe(409);
  });
});

