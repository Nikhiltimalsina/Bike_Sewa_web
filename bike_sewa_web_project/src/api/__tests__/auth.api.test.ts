import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/axios', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: { message: 'ok', token: 'abc', user: {} } })),
    get: vi.fn(() => Promise.resolve({ data: { user: {} } })),
    put: vi.fn(() => Promise.resolve({ data: { message: 'ok', user: {} } })),
  },
}));

import { loginApi, registerApi } from '../auth.api';

describe('auth.api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have loginApi defined', () => {
    expect(loginApi).toBeDefined();
    expect(typeof loginApi).toBe('function');
  });

  it('should have registerApi defined', () => {
    expect(registerApi).toBeDefined();
    expect(typeof registerApi).toBe('function');
  });

  it('loginApi should accept email and password', async () => {
    const result = loginApi({ email: 'test@test.com', password: 'password123' });
    expect(result).toBeInstanceOf(Promise);
  });

  it('registerApi should accept user registration data', () => {
    const result = registerApi({
      fullName: 'Test User',
      email: 'test@test.com',
      phone: '9876543210',
      password: 'password123',
    });
    expect(result).toBeInstanceOf(Promise);
  });
});
