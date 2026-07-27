import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

vi.mock('../../repositories/user.repository', () => ({
  default: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    findAll: vi.fn(),
    updateById: vi.fn(),
    deleteById: vi.fn(),
    countUsers: vi.fn(),
  },
}));

vi.mock('../../repositories/bike.repository', () => ({
  default: {
    countAll: vi.fn(),
  },
}));

vi.mock('../../repositories/booking.repository', () => ({
  default: {
    countAll: vi.fn(),
  },
}));

vi.mock('bcryptjs');
vi.mock('jsonwebtoken');

import UserService from '../user.service';
import UserRepository from '../../repositories/user.repository';
import BikeRepository from '../../repositories/bike.repository';
import BookingRepository from '../../repositories/booking.repository';

const mockUser = {
  _id: { toString: () => 'user1' },
  fullName: 'Test User',
  email: 'test@example.com',
  phone: '1234567890',
  role: 'user',
  avatar: '',
  password: 'hashedPassword',
};

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      vi.mocked(UserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedPassword' as never);
      vi.mocked(UserRepository.create).mockResolvedValue(mockUser as any);

      const result = await UserService.register({
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'Password123!',
      } as any);

      expect(result.message).toBe('Registration successful');
      expect(result.user.fullName).toBe('Test User');
      expect(UserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(UserRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      vi.mocked(UserRepository.findByEmail).mockResolvedValue(mockUser as any);

await expect(
        UserService.register({
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          password: 'Password123!',
        } as any)
      ).rejects.toThrow('An account with this email already exists');
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      vi.mocked(UserRepository.findByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockReturnValue('mock-token' as never);

      const result = await UserService.login({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.message).toBe('Login successful');
      expect(result.token).toBe('mock-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw if email not found', async () => {
      vi.mocked(UserRepository.findByEmail).mockResolvedValue(null);
      await expect(
        UserService.login({ email: 'nobody@example.com', password: 'pass' })
      ).rejects.toThrow('No account found with this email');
    });

    it('should throw if password is incorrect', async () => {
      vi.mocked(UserRepository.findByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      await expect(
        UserService.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow('Incorrect password');
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      vi.mocked(UserRepository.findById).mockResolvedValue(mockUser as any);
      const profile = await UserService.getProfile('user1');
      expect(profile.email).toBe('test@example.com');
    });

    it('should throw if user not found', async () => {
      vi.mocked(UserRepository.findById).mockResolvedValue(null);
      await expect(UserService.getProfile('nobody')).rejects.toThrow('User not found');
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      vi.mocked(UserRepository.findById).mockResolvedValue(mockUser as any);
      vi.mocked(UserRepository.updateById).mockResolvedValue(mockUser as any);

      const result = await UserService.updateProfile('user1', {
        fullName: 'Updated Name',
        phone: '9876543210',
      });

      expect(result.message).toBe('Profile updated successfully');
      expect(UserRepository.updateById).toHaveBeenCalled();
    });

    it('should update password when both current and new provided', async () => {
      vi.mocked(UserRepository.findById).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(bcrypt.hash).mockResolvedValue('newHashedPassword' as never);
      vi.mocked(UserRepository.updateById).mockResolvedValue(mockUser as any);

      await UserService.updateProfile('user1', {
        fullName: 'Test',
        currentPassword: 'oldPass',
        newPassword: 'NewPass123!',
      });

      expect(bcrypt.compare).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
    });
  });

  describe('admin methods', () => {
    it('getAllUsers should return all users', async () => {
      vi.mocked(UserRepository.findAll).mockResolvedValue([mockUser] as any);
      const users = await UserService.getAllUsers();
      expect(users).toHaveLength(1);
    });

    it('updateUserRole should update role', async () => {
      vi.mocked(UserRepository.updateById).mockResolvedValue({ ...mockUser, role: 'admin' } as any);
      const result = await UserService.updateUserRole('user1', 'admin' as any);
      expect(result.role).toBe('admin');
    });

    it('adminCreateUser should create user', async () => {
      vi.mocked(UserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed' as never);
      vi.mocked(UserRepository.create).mockResolvedValue(mockUser as any);
      const result = await UserService.adminCreateUser({
        fullName: 'Admin Created',
        email: 'new@example.com',
        phone: '1234567890',
        password: 'Pass123!',
        role: 'user',
      });
      expect(result.fullName).toBe('Test User');
    });

    it('deleteUser should delete user', async () => {
      vi.mocked(UserRepository.deleteById).mockResolvedValue(mockUser as any);
      await expect(UserService.deleteUser('user1')).resolves.not.toThrow();
    });

    it('deleteUser should throw if user not found', async () => {
      vi.mocked(UserRepository.deleteById).mockResolvedValue(null);
      await expect(UserService.deleteUser('nobody')).rejects.toThrow('User not found');
    });

    it('getUserStats should return stats', async () => {
      vi.mocked(UserRepository.countUsers).mockResolvedValue(10);
      vi.mocked(BikeRepository.countAll).mockResolvedValue(5);
      vi.mocked(BookingRepository.countAll).mockResolvedValue(20);
      const stats = await UserService.getUserStats();
      expect(stats.totalUsers).toBe(10);
      expect(stats.totalBikes).toBe(5);
      expect(stats.totalBookings).toBe(20);
    });
  });
});

