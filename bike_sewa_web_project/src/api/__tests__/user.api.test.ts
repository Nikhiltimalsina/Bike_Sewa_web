import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

import { whoamiApi, updateProfileApi } from '../user.api';

describe('user.api', () => {
  beforeEach(() => vi.clearAllMocks());

  it('whoamiApi returns a promise', () => {
    expect(whoamiApi()).toBeInstanceOf(Promise);
  });

  it('updateProfileApi returns a promise without file', () => {
    const result = updateProfileApi({ fullName: 'Updated' });
    expect(result).toBeInstanceOf(Promise);
  });
});
