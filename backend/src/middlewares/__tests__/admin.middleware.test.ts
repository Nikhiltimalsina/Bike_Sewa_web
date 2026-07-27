import { describe, it, expect, vi, beforeEach } from 'vitest';
import adminMiddleware from '../admin.middleware';

describe('adminMiddleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {};
    mockRes = {};
    mockNext = vi.fn();
  });

  it('should pass for admin users', () => {
    mockReq.user = { userId: 'admin1', email: 'admin@example.com', role: 'admin' };
    adminMiddleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should fail if no user (authorizedMiddleware should run first)', () => {
    adminMiddleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Authentication required' }));
  });

  it('should fail for non-admin users', () => {
    mockReq.user = { userId: 'user1', email: 'user@example.com', role: 'user' };
    adminMiddleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Admin access required' }));
  });
});

