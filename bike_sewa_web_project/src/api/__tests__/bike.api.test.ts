import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

import { getBikesApi, getBikeByIdApi, searchBikesApi } from '../bike.api';

describe('bike.api', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getBikesApi returns a promise', () => {
    expect(getBikesApi()).toBeInstanceOf(Promise);
  });

  it('getBikesApi accepts availableOnly param', () => {
    expect(getBikesApi(true)).toBeInstanceOf(Promise);
  });

  it('getBikeByIdApi returns a promise', () => {
    expect(getBikeByIdApi('123')).toBeInstanceOf(Promise);
  });

  it('searchBikesApi returns a promise', () => {
    expect(searchBikesApi('Kathmandu')).toBeInstanceOf(Promise);
  });
});
