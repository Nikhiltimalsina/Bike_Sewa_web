import { Request, Response, NextFunction } from "express";
import bookingService from "../services/booking.service";
import { IBookingDocument } from "../models/booking.model";
import { BadRequestException } from "../exceptions/http-exception";

const toBookingJson = (booking: IBookingDocument) => {
  const populatedBike = booking.bikeId as any;

  return {
    id: booking._id.toString(),
    bikeId:
      populatedBike && populatedBike._id
        ? populatedBike._id.toString()
        : booking.bikeId.toString(),
    bikeName: populatedBike?.name ?? "",
    bikeImageUrl: populatedBike?.imageUrl ?? null,
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
    totalPrice: booking.totalPrice,
    status: booking.status,
    pickupLocation: booking.pickupLocation,
  };
};

class BookingController {
  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { bikeId, startDate, endDate } = req.body;

      if (!bikeId || !startDate || !endDate) {
        throw new BadRequestException(
          "bikeId, startDate, and endDate are required"
        );
      }

      const booking = await bookingService.createBooking(
        userId,
        bikeId,
        new Date(startDate),
        new Date(endDate)
      );

      const populated = await bookingService.getBookingById(
        booking._id.toString(),
        userId
      );

      res.status(201).json({
        message: "Booking created successfully",
        booking: toBookingJson(populated),
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const bookings = await bookingService.getMyBookings(userId);
      res.status(200).json({ bookings: bookings.map(toBookingJson) });
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const booking = await bookingService.getBookingById(
        req.params.id,
        userId
      );
      res.status(200).json({ booking: toBookingJson(booking) });
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const booking = await bookingService.cancelBooking(
        req.params.id,
        userId
      );
      res.status(200).json({
        message: "Booking cancelled successfully",
        booking: toBookingJson(booking),
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BookingController();