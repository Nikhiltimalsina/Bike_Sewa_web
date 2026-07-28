 import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRemove = vi.fn();

 vi.mock('@/api/auth.api', () => ({
  loginApi: vi.fn(() => Promise.resolve({ message: 'Login successful', token: 'abc', user: { fullName: 'Test', email: 'test@test.com', role: 'user' } })),
  registerApi: vi.fn(() => Promise.resolve({ message: 'Registration successful', user: { fullName: 'Test', email: 'test@test.com', role: 'user' } })),
}));

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: (...args: unknown[]) => mockRemove(...args),
  },
  get: vi.fn(),
  set: vi.fn(),
  remove: (...args: unknown[]) => mockRemove(...args),
}));

import { loginAction, registerAction, logoutAction } from '../auth.action';

describe('auth.action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loginAction returns a promise with LoginPayload', () => {
    const result = loginAction({ email: 'test@test.com', password: 'password123' });
    expect(result).toBeInstanceOf(Promise);
  });

  it('registerAction returns a promise with full RegisterPayload', () => {
    const result = registerAction({
      fullName: 'Test User',
      email: 'test@test.com',
      phone: '9876543210',
      password: 'password123',
    });
    expect(result).toBeInstanceOf(Promise);
  });

  it('logoutAction removes auth_token cookie', () => {
    logoutAction();
    expect(mockRemove).toHaveBeenCalledWith('auth_token');
  });
});
