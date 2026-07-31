import bookingRepository from "../repositories/booking.repository";
import bikeRepository from "../repositories/bike.repository";
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from "../exceptions/http-exception";
import { IBookingDocument } from "../models/booking.model";
import { BookingStatus } from "../types/booking.type";

class BookingService {
  async createBooking(
    userId: string,
    bikeId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IBookingDocument> {
    if (!(startDate < endDate)) {
      throw new BadRequestException("Start date must be before end date");
    }

    const bike = await bikeRepository.findById(bikeId);
    if (!bike) throw new NotFoundException("Bike not found");
    if (!bike.isAvailable) {
      throw new BadRequestException("Bike is not available for booking");
    }

    const hours = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
    );
    const totalPrice = hours * bike.pricePerHour;

    const booking = await bookingRepository.create({
      userId,
      bikeId,
      startDate,
      endDate,
      totalPrice,
      pickupLocation: bike.location,
    });

    await bikeRepository.setAvailability(bikeId, false);

    return booking;
  }

  async getMyBookings(userId: string): Promise<IBookingDocument[]> {
    return bookingRepository.findByUser(userId);
  }

  async getBookingById(
    id: string,
    userId: string
  ): Promise<IBookingDocument> {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.userId.toString() !== userId) {
      throw new UnauthorizedException("You do not have access to this booking");
    }
    return booking;
  }

  async cancelBooking(id: string, userId: string): Promise<IBookingDocument> {
    const booking = await this.getBookingById(id, userId);

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException("Booking is already cancelled");
    }
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException("Cannot cancel a completed booking");
    }

    const updated = await bookingRepository.updateStatus(
      id,
      BookingStatus.CANCELLED
    );

    await bikeRepository.setAvailability(booking.bikeId.toString(), true);

    return updated as IBookingDocument;
  }

  async completeBooking(id: string, userId: string): Promise<IBookingDocument> {
    const booking = await this.getBookingById(id, userId);

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException("Booking is already completed");
    }
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException("Cannot complete a cancelled booking");
    }

    const updated = await bookingRepository.updateStatus(
      id,
      BookingStatus.COMPLETED
    );

    await bikeRepository.setAvailability(booking.bikeId.toString(), true);

    return updated as IBookingDocument;
  }

  async getAllBookings(): Promise<IBookingDocument[]> {
    return bookingRepository.findAll();
  }

  async updateBookingStatus(
    id: string,
    status: string
  ): Promise<IBookingDocument> {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new NotFoundException("Booking not found");
    if (!Object.values(BookingStatus).includes(status as BookingStatus)) {
      throw new BadRequestException("Invalid booking status");
    }
    const updated = await bookingRepository.updateStatus(
      id,
      status as BookingStatus
    );
    if (!updated) throw new NotFoundException("Booking not found");
    return updated;
  }
}

export default new BookingService();