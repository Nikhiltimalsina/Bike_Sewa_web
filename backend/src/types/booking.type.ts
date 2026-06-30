export enum BookingStatus {
  CONFIRMED = "confirmed",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface IBooking {
  _id: string;
  userId: string;
  bikeId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: BookingStatus;
  pickupLocation: string;
  createdAt: Date;
  updatedAt: Date;
}