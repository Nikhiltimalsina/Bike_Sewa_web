import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../repositories/booking.repository', () => ({
  default: {
    create: vi.fn(),
    findByUser: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    updateStatus: vi.fn(),
    countAll: vi.fn(),
  },
}));

vi.mock('../../repositories/bike.repository', () => ({
  default: {
    findById: vi.fn(),
    setAvailability: vi.fn(),
    countAll: vi.fn(),
  },
}));

import bookingService from '../booking.service';
import bookingRepository from '../../repositories/booking.repository';
import bikeRepository from '../../repositories/bike.repository';
import { BookingStatus } from '../../types/booking.type';

const mockBike = {
  _id: { toString: () => 'bike1' },
  name: 'Yamaha MT-15',
  location: 'Kathmandu',
  pricePerHour: 500,
  isAvailable: true,
};

const mockBooking = {
  _id: { toString: () => 'booking1' },
  userId: { toString: () => 'user1' },
  bikeId: { toString: () => 'bike1' },
  startDate: new Date('2025-01-10'),
  endDate: new Date('2025-01-15'),
  totalPrice: 2500,
  status: 'pending',
  pickupLocation: 'Kathmandu',
};

describe('BookingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      vi.mocked(bikeRepository.findById).mockResolvedValue(mockBike as any);
      vi.mocked(bookingRepository.create).mockResolvedValue(mockBooking as any);
      vi.mocked(bikeRepository.setAvailability).mockResolvedValue({ ...mockBike, isAvailable: false } as any);

const startDate = new Date('2025-01-10');
      const endDate = new Date('2025-01-15');
      const booking = await bookingService.createBooking('user1', 'bike1', startDate, endDate, null);
      expect(booking.totalPrice).toBe(2500);
    });

    it('should throw if dates are invalid', async () => {
      const startDate = new Date('2025-01-10');
      const endDate = new Date('2025-01-09');
      await expect(
        bookingService.createBooking('user1', 'bike1', startDate, endDate, null)
      ).rejects.toThrow('Start date must be before end date');
    });

    it('should throw if bike not found', async () => {
      vi.mocked(bikeRepository.findById).mockResolvedValue(null);
      await expect(
        bookingService.createBooking('user1', 'bike1', new Date('2025-01-10'), new Date('2025-01-15'), null)
      ).rejects.toThrow('Bike not found');
    });

    it('should throw if bike is not available', async () => {
      vi.mocked(bikeRepository.findById).mockResolvedValue({ ...mockBike, isAvailable: false } as any);
      await expect(
        bookingService.createBooking('user1', 'bike1', new Date('2025-01-10'), new Date('2025-01-15'), null)
      ).rejects.toThrow('Bike is not available for booking');
    });
  });

  describe('getMyBookings', () => {
    it('should return user bookings', async () => {
      vi.mocked(bookingRepository.findByUser).mockResolvedValue([mockBooking] as any);
      const bookings = await bookingService.getMyBookings('user1');
      expect(bookings).toHaveLength(1);
    });
  });

  describe('getBookingById', () => {
    it('should return booking by id', async () => {
      vi.mocked(bookingRepository.findById).mockResolvedValue(mockBooking as any);
      const booking = await bookingService.getBookingById('booking1', 'user1');
      expect(booking).toBeDefined();
    });

    it('should throw if booking not found', async () => {
      vi.mocked(bookingRepository.findById).mockResolvedValue(null);
      await expect(bookingService.getBookingById('nonexistent', 'user1')).rejects.toThrow('Booking not found');
    });

    it('should throw if user does not own booking', async () => {
      vi.mocked(bookingRepository.findById).mockResolvedValue(mockBooking as any);
      await expect(bookingService.getBookingById('booking1', 'otheruser')).rejects.toThrow('You do not have access to this booking');
    });
  });

  describe('getAllBookings', () => {
    it('should return all bookings', async () => {
      vi.mocked(bookingRepository.findAll).mockResolvedValue([mockBooking] as any);
      const bookings = await bookingService.getAllBookings();
      expect(bookings).toHaveLength(1);
    });
  });

  describe('updateBookingStatus', () => {
    it('should update booking status', async () => {
      vi.mocked(bookingRepository.findById).mockResolvedValue(mockBooking as any);
      vi.mocked(bookingRepository.updateStatus).mockResolvedValue({ ...mockBooking, status: 'completed' } as any);
      vi.mocked(bikeRepository.setAvailability).mockResolvedValue(mockBike as any);

      const booking = await bookingService.updateBookingStatus('booking1', BookingStatus.COMPLETED);
      expect(booking.status).toBe('completed');
    });

    it('should throw if booking not found', async () => {
      vi.mocked(bookingRepository.findById).mockResolvedValue(null);
      await expect(bookingService.updateBookingStatus('nonexistent', BookingStatus.COMPLETED)).rejects.toThrow('Booking not found');
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking', async () => {
      vi.mocked(bookingRepository.findById).mockResolvedValue(mockBooking as any);
      vi.mocked(bookingRepository.updateStatus).mockResolvedValue({ ...mockBooking, status: 'cancelled' } as any);
      vi.mocked(bikeRepository.setAvailability).mockResolvedValue(mockBike as any);

      const booking = await bookingService.cancelBooking('booking1', 'user1');
      expect(booking.status).toBe('cancelled');
    });

    it('should throw if already cancelled', async () => {
      vi.mocked(bookingRepository.findById).mockResolvedValue({ ...mockBooking, status: 'cancelled' } as any);
      await expect(bookingService.cancelBooking('booking1', 'user1')).rejects.toThrow('Booking is already cancelled');
    });

    it('should throw if already completed', async () => {
      vi.mocked(bookingRepository.findById).mockResolvedValue({ ...mockBooking, status: 'completed' } as any);
      await expect(bookingService.cancelBooking('booking1', 'user1')).rejects.toThrow('Cannot cancel a completed booking');
    });
  });
});

