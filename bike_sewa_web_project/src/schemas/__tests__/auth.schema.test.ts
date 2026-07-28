import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../auth.schema';

describe('auth.schema', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const result = loginSchema.safeParse({ email: 'test@test.com', password: 'password123' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({ email: 'invalid', password: 'password123' });
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({ email: 'test@test.com', password: '' });
      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const result = loginSchema.safeParse({ password: 'password123' });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const result = registerSchema.safeParse({
        fullName: 'Test User',
        email: 'test@test.com',
        phone: '9876543210',
        password: 'Password1',
        confirmPassword: 'Password1',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing fullName', () => {
      const result = registerSchema.safeParse({
        email: 'test@test.com',
        phone: '9876543210',
        password: 'Password1',
        confirmPassword: 'Password1',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = registerSchema.safeParse({
        fullName: 'Test User',
        email: 'test@test.com',
        phone: '9876543210',
        password: 'Abc1',
        confirmPassword: 'Abc1',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing password uppercase', () => {
      const result = registerSchema.safeParse({
        fullName: 'Test User',
        email: 'test@test.com',
        phone: '9876543210',
        password: 'password1',
        confirmPassword: 'password1',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing password number', () => {
      const result = registerSchema.safeParse({
        fullName: 'Test User',
        email: 'test@test.com',
        phone: '9876543210',
        password: 'Password',
        confirmPassword: 'Password',
      });
      expect(result.success).toBe(false);
    });

    it('should reject mismatched passwords', () => {
      const result = registerSchema.safeParse({
        fullName: 'Test User',
        email: 'test@test.com',
        phone: '9876543210',
        password: 'Password1',
        confirmPassword: 'Password2',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid phone format', () => {
      const result = registerSchema.safeParse({
        fullName: 'Test User',
        email: 'test@test.com',
        phone: '12345',
        password: 'Password1',
        confirmPassword: 'Password1',
      });
      expect(result.success).toBe(false);
    });
  });
});
