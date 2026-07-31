import PaymentModel, { IPaymentDocument } from "../models/payment.model";
import { PaymentStatus, PaymentMethod } from "../types/payment.type";

class PaymentRepository {
  async create(data: {
    bookingId: string;
    userId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId: string;
    paidAt: Date;
    receiptUrl?: string;
  }): Promise<IPaymentDocument> {
    const payment = new PaymentModel(data);
    return payment.save();
  }

  async findByUser(userId: string): Promise<IPaymentDocument[]> {
    return PaymentModel.find({ userId })
      .populate("bookingId")
      .sort({ paidAt: -1 });
  }

  async findById(id: string): Promise<IPaymentDocument | null> {
    return PaymentModel.findById(id).populate("bookingId");
  }

  async updateStatus(
    id: string,
    status: PaymentStatus
  ): Promise<IPaymentDocument | null> {
    return PaymentModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}

export default new PaymentRepository();