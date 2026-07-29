import BookingModel, { IBookingDocument } from "../models/booking.model";
import { BookingStatus } from "../types/booking.type";

class BookingRepository {
  async create(data: {
    userId: string;
    bikeId: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    pickupLocation: string;
    paymentMethod?: string;
  }): Promise<IBookingDocument> {
    const booking = new BookingModel(data);
    return booking.save();
  }

  async findAll(): Promise<IBookingDocument[]> {
    return BookingModel.find().populate("bikeId").sort({ createdAt: -1 });
  }

  async countDocuments(): Promise<number> {
    return BookingModel.countDocuments();
  }

  async findByUser(userId: string): Promise<IBookingDocument[]> {
    return BookingModel.find({ userId })
      .populate("bikeId")
      .sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IBookingDocument | null> {
    return BookingModel.findById(id).populate("bikeId");
  }

  async updateStatus(
    id: string,
    status: BookingStatus
  ): Promise<IBookingDocument | null> {
    return BookingModel.findByIdAndUpdate(id, { status }, { new: true }).populate(
      "bikeId"
    );
  }
}

export default new BookingRepository();