import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

vi.mock('jsonwebtoken');

import authorizedMiddleware from '../authorized.middleware';

describe('authorizedMiddleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = { headers: {} };
    mockRes = {};
    mockNext = vi.fn();
  });

  it('should pass with valid token', () => {
    vi.mocked(jwt.verify).mockReturnValue({ userId: 'user1', email: 'test@example.com', role: 'user' } as any);
    mockReq.headers.authorization = 'Bearer valid-token';

    authorizedMiddleware(mockReq, mockRes, mockNext);

    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.userId).toBe('user1');
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should fail when no token provided', () => {
    authorizedMiddleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid or expired token' }));
  });

  it('should fail with invalid authorization header', () => {
    mockReq.headers.authorization = 'Invalid';
    authorizedMiddleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid or expired token' }));
  });

  it('should fail with any jwt.verify error', () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error('any jwt error');
    });
    mockReq.headers.authorization = 'Bearer some-token';
    authorizedMiddleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid or expired token' }));
  });
});
