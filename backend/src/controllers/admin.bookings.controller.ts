import { Request, Response, NextFunction } from "express";
import bookingService from "../services/booking.service";
import { BadRequestException, NotFoundException } from "../exceptions/http-exception";

const toBookingJson = (booking: any) => {
  const populatedBike = booking.bikeId as any;
  return {
    id: booking._id.toString(),
    bikeId:
      populatedBike && populatedBike._id
        ? populatedBike._id.toString()
        : booking.bikeId.toString(),
    bikeName: populatedBike?.name ?? "",
    bikeImageUrl: populatedBike?.imageUrl ?? null,
    userId: booking.userId,
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
    totalPrice: booking.totalPrice,
    status: booking.status,
    pickupLocation: booking.pickupLocation,
    createdAt: booking.createdAt,
  };
};

const AdminBookingsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await bookingService.getAllBookings();
      res.status(200).json({ bookings: bookings.map(toBookingJson) });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      if (!status) {
        throw new BadRequestException("Status is required");
      }
      const booking = await bookingService.updateBookingStatus(
        req.params.id,
        status
      );
      res.status(200).json({
        message: "Booking status updated successfully",
        booking: toBookingJson(booking),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default AdminBookingsController;