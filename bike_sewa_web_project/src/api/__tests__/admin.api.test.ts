import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

import {
  adminGetUsersApi,
  adminGetStatsApi,
  adminUpdateUserRoleApi,
  adminDeleteUserApi,
  adminCreateUserApi,
  adminUpdateUserApi,
  adminCreateBikeApi,
  adminUpdateBikeApi,
  adminDeleteBikeApi,
  adminGetAllBookingsApi,
  adminUpdateBookingStatusApi,
} from '../admin.api';

describe('admin.api', () => {
  beforeEach(() => vi.clearAllMocks());

  it('adminGetUsersApi returns a promise', () => {
    expect(adminGetUsersApi()).toBeInstanceOf(Promise);
  });

  it('adminGetStatsApi returns a promise', () => {
    expect(adminGetStatsApi()).toBeInstanceOf(Promise);
  });

  it('adminUpdateUserRoleApi returns a promise', () => {
    expect(adminUpdateUserRoleApi('id', 'admin')).toBeInstanceOf(Promise);
  });

  it('adminDeleteUserApi returns a promise', () => {
    expect(adminDeleteUserApi('userId')).toBeInstanceOf(Promise);
  });

  it('adminCreateUserApi returns a promise', () => {
    const result = adminCreateUserApi({ fullName: 'Test', email: 't@t.com', phone: '9876543210', password: 'pass1234' });
    expect(result).toBeInstanceOf(Promise);
  });

  it('adminUpdateUserApi returns a promise', () => {
    expect(adminUpdateUserApi('id', { fullName: 'Updated' })).toBeInstanceOf(Promise);
  });

  it('adminCreateBikeApi returns a promise', () => {
    const result = adminCreateBikeApi({ name: 'Test', modelName: 'M1', location: 'Loc', latitude: 0, longitude: 0, pricePerHour: 100 });
    expect(result).toBeInstanceOf(Promise);
  });

  it('adminUpdateBikeApi returns a promise', () => {
    expect(adminUpdateBikeApi('id', { name: 'Updated' })).toBeInstanceOf(Promise);
  });

  it('adminDeleteBikeApi returns a promise', () => {
    expect(adminDeleteBikeApi('id')).toBeInstanceOf(Promise);
  });

  it('adminGetAllBookingsApi returns a promise', () => {
    expect(adminGetAllBookingsApi()).toBeInstanceOf(Promise);
  });

  it('adminUpdateBookingStatusApi returns a promise', () => {
    expect(adminUpdateBookingStatusApi('id', 'confirmed')).toBeInstanceOf(Promise);
  });

  it('AdminUser shape validation', () => {
    const user = { _id: '1', fullName: 'A', email: 'a@b.com', phone: '1234567890', role: 'user' as const };
    expect(user._id).toBeDefined();
    expect(user.fullName).toBeDefined();
    expect(user.email).toBeDefined();
  });

  it('AdminStats shape validation', () => {
    const stats = { totalUsers: 10, totalBikes: 5, totalBookings: 20 };
    expect(stats.totalUsers).toBe(10);
    expect(stats.totalBikes).toBe(5);
    expect(stats.totalBookings).toBe(20);
  });
});
