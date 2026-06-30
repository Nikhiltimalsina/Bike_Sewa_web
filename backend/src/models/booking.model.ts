import mongoose, { Schema, Document, Types } from "mongoose";
import { BookingStatus } from "../types/booking.type";

export interface IBookingDocument extends Document {
  userId: Types.ObjectId;
  bikeId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: BookingStatus;
  pickupLocation: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bikeId: {
      type: Schema.Types.ObjectId,
      ref: "Bike",
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.CONFIRMED,
    },
    pickupLocation: {
      type: String,
      required: [true, "Pickup location is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const BookingModel = mongoose.model<IBookingDocument>("Booking", BookingSchema);

export default BookingModel;