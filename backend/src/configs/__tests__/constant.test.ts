import { describe, it, expect } from 'vitest';

describe('config constants', () => {
  it('should have default values', async () => {
    const constants = await import('../constant');
    expect(constants.PORT).toBeDefined();
    expect(constants.JWT_SECRET).toBeDefined();
    expect(constants.JWT_EXPIRES_IN).toBeDefined();
    expect(constants.SALT_ROUNDS).toBe(10);
    expect(constants.CORS_ORIGINS).toContain('http://localhost:3000');
    expect(constants.CORS_ORIGINS).toContain('http://localhost:3001');
  });
});
