import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/booking.service', () => ({
  default: {
    createBooking: vi.fn(),
    getMyBookings: vi.fn(),
    getBookingById: vi.fn(),
    getAllBookings: vi.fn(),
    updateBookingStatus: vi.fn(),
    cancelBooking: vi.fn(),
  },
}));

import bookingController from '../booking.controller';
import bookingService from '../../services/booking.service';

describe('bookingController', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = { params: {}, body: {}, user: { userId: 'user1' } };
    mockRes = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    mockNext = vi.fn();
  });

it('createBooking should create booking', async () => {
    vi.mocked(bookingService.createBooking).mockResolvedValue({ _id: { toString: () => 'b1' }, pricePerHour: 500 } as any);
    vi.mocked(bookingService.getBookingById).mockResolvedValue({ _id: { toString: () => 'b1' }, bikeId: { toString: () => 'bike1' }, startDate: new Date(), endDate: new Date(), totalPrice: 500, status: 'pending' } as any);
    mockReq.body = { bikeId: 'bike1', startDate: '2025-03-01', endDate: '2025-03-05' };
    await bookingController.createBooking(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  it('getMyBookings should return bookings', async () => {
    vi.mocked(bookingService.getMyBookings).mockResolvedValue([] as any);
    await bookingController.getMyBookings(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('getBookingById should return booking', async () => {
    mockReq.params = { id: 'booking1' };
    vi.mocked(bookingService.getBookingById).mockResolvedValue({} as any);
    await bookingController.getBookingById(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('cancelBooking should cancel booking', async () => {
    mockReq.params = { id: 'booking1' };
    vi.mocked(bookingService.cancelBooking).mockResolvedValue({} as any);
    await bookingController.cancelBooking(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
