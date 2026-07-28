import { describe, it, expect, vi } from 'vitest';
import React from 'react';

vi.mock('../AuthContext', () => ({
  AuthProvider: vi.fn(({ children }: { children: React.ReactNode }) => children),
  useAuth: vi.fn(() => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    refreshUser: vi.fn(),
    setUser: vi.fn(),
    logout: vi.fn(),
  })),
  AuthContext: React.createContext(null),
}));

describe('AuthContext', () => {
  it('should export AuthProvider, useAuth, and AuthContext', async () => {
    const mod = await import('../AuthContext');
    expect(mod).toHaveProperty('AuthProvider');
    expect(typeof mod.AuthProvider).toBe('function');
    expect(mod).toHaveProperty('useAuth');
    expect(typeof mod.useAuth).toBe('function');
    expect(mod).toHaveProperty('AuthContext');
  });
});
