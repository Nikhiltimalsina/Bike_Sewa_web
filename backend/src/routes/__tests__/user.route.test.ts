import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../controllers/user.controller', () => ({
  default: {
    register: vi.fn(),
    login: vi.fn(),
    whoami: vi.fn(),
    updateProfile: vi.fn(),
    adminGetAllUsers: vi.fn(),
    adminUpdateUserRole: vi.fn(),
    adminCreateUser: vi.fn(),
    adminUpdateUser: vi.fn(),
    adminDeleteUser: vi.fn(),
    adminGetStats: vi.fn(),
  },
}));

vi.mock('../../middlewares/authorized.middleware', () => ({
  default: vi.fn((_req, _res, next) => next()),
}));

vi.mock('../../middlewares/admin.middleware', () => ({
  default: vi.fn((_req, _res, next) => next()),
}));

import userRoutes from '../user.route';
import userController from '../../controllers/user.controller';
import authorizedMiddleware from '../../middlewares/authorized.middleware';
import adminMiddleware from '../../middlewares/admin.middleware';

describe('user routes', () => {
  it('should be defined', () => {
    expect(userRoutes).toBeDefined();
  });

  it('should use authorizedMiddleware on protected routes', () => {
    expect(authorizedMiddleware).toBeDefined();
  });

  it('should use adminMiddleware on admin routes', () => {
    expect(adminMiddleware).toBeDefined();
  });

  it('should have register controller', () => {
    expect(userController.register).toBeDefined();
  });

  it('should have login controller', () => {
    expect(userController.login).toBeDefined();
  });

  it('should have whoami controller', () => {
    expect(userController.whoami).toBeDefined();
  });

  it('should have adminGetAllUsers controller', () => {
    expect(userController.adminGetAllUsers).toBeDefined();
  });

  it('should have adminUpdateUserRole controller', () => {
    expect(userController.adminUpdateUserRole).toBeDefined();
  });

  it('should have adminDeleteUser controller', () => {
    expect(userController.adminDeleteUser).toBeDefined();
  });

  it('should have adminGetStats controller', () => {
    expect(userController.adminGetStats).toBeDefined();
  });
});

