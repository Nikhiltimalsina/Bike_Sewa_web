import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/user.service', () => ({
  default: {
    register: vi.fn(),
    login: vi.fn(),
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    getAllUsers: vi.fn(),
    updateUserRole: vi.fn(),
    adminCreateUser: vi.fn(),
    adminUpdateUser: vi.fn(),
    deleteUser: vi.fn(),
    getUserStats: vi.fn(),
  },
}));

vi.mock('../../dtos/user.dto', () => ({
  validateRegisterDto: vi.fn(() => []),
  validateLoginDto: vi.fn(() => []),
  validateUpdateProfileDto: vi.fn(() => []),
  validateAdminCreateUserDto: vi.fn(() => []),
  validateAdminUpdateUserDto: vi.fn(() => []),
}));

import UserController from '../user.controller';
import UserService from '../../services/user.service';
import { validateRegisterDto, validateLoginDto, validateUpdateProfileDto } from '../../dtos/user.dto';

describe('UserController', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = { body: {}, params: {}, user: null };
    mockRes = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    mockNext = vi.fn();
  });

  describe('register', () => {
    it('should register and return 201', async () => {
      vi.mocked(UserService.register).mockResolvedValue({ message: 'ok', user: {} as any });
      mockReq.body = { fullName: 'Test', email: 'test@example.com', password: 'Pass123!' };
      await UserController.register(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should call next on validation error', async () => {
      vi.mocked(validateRegisterDto).mockReturnValue(['Invalid data']);
      mockReq.body = {};
      await UserController.register(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login and return 200', async () => {
      vi.mocked(UserService.login).mockResolvedValue({ message: 'ok', token: 't', user: {} as any });
      mockReq.body = { email: 'test@example.com', password: 'Pass123!' };
      await UserController.login(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('whoami', () => {
    it('should return user profile', async () => {
      mockReq.user = { userId: 'user1' };
      vi.mocked(UserService.getProfile).mockResolvedValue({} as any);
      await UserController.whoami(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should fail if not authenticated', async () => {
      await UserController.whoami(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not authenticated' }));
    });
  });

  describe('updateProfile', () => {
    it('should update profile', async () => {
      mockReq.user = { userId: 'user1' };
      mockReq.body = { fullName: 'Updated' };
      vi.mocked(UserService.updateProfile).mockResolvedValue({ message: 'ok', user: {} as any });
      await UserController.updateProfile(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('adminGetAllUsers', () => {
    it('should return all users', async () => {
      vi.mocked(UserService.getAllUsers).mockResolvedValue([]);
      await UserController.adminGetAllUsers(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('adminUpdateUserRole', () => {
    it('should update user role', async () => {
      mockReq.params = { userId: 'user1' };
      mockReq.body = { role: 'admin' };
      vi.mocked(UserService.updateUserRole).mockResolvedValue({} as any);
      await UserController.adminUpdateUserRole(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should fail with invalid role', async () => {
      mockReq.params = { userId: 'user1' };
      mockReq.body = { role: 'invalid' };
      await UserController.adminUpdateUserRole(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('adminDeleteUser', () => {
    it('should delete user', async () => {
      mockReq.params = { userId: 'user1' };
      await UserController.adminDeleteUser(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('adminGetStats', () => {
    it('should return stats', async () => {
      vi.mocked(UserService.getUserStats).mockResolvedValue({ totalUsers: 10, totalBikes: 5, totalBookings: 20 });
      await UserController.adminGetStats(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});

