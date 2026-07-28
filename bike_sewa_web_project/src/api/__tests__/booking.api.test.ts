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
  createBookingApi,
  getMyBookingsApi,
  getBookingByIdApi,
  cancelBookingApi,
  returnBikeApi,
} from '../booking.api';

describe('booking.api', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should have all API functions defined', () => {
    expect(createBookingApi).toBeDefined();
    expect(getMyBookingsApi).toBeDefined();
    expect(getBookingByIdApi).toBeDefined();
    expect(cancelBookingApi).toBeDefined();
    expect(returnBikeApi).toBeDefined();
  });

  it('createBookingApi returns a promise', () => {
    const result = createBookingApi({ bikeId: '123', startDate: '2024-01-01', endDate: '2024-01-02' });
    expect(result).toBeInstanceOf(Promise);
  });

  it('getMyBookingsApi returns a promise', () => {
    const result = getMyBookingsApi();
    expect(result).toBeInstanceOf(Promise);
  });

  it('getBookingByIdApi returns a promise', () => {
    const result = getBookingByIdApi('booking123');
    expect(result).toBeInstanceOf(Promise);
  });

  it('cancelBookingApi returns a promise', () => {
    const result = cancelBookingApi('booking123');
    expect(result).toBeInstanceOf(Promise);
  });

  it('returnBikeApi returns a promise', () => {
    const result = returnBikeApi('booking123');
    expect(result).toBeInstanceOf(Promise);
  });
});

