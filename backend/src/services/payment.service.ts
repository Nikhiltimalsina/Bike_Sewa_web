import paymentRepository from "../repositories/payment.repository";
import bookingRepository from "../repositories/booking.repository";
import { NotFoundException, BadRequestException } from "../exceptions/http-exception";
import { IPaymentDocument } from "../models/payment.model";
import { PaymentStatus, PaymentMethod } from "../types/payment.type";

class PaymentService {
  async processPayment(
    userId: string,
    bookingId: string,
    amount: number,
    method: PaymentMethod
  ): Promise<IPaymentDocument> {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.userId.toString() !== userId) {
      throw new BadRequestException("This booking does not belong to you");
    }

    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const payment = await paymentRepository.create({
      bookingId,
      userId,
      amount,
      method,
      status: PaymentStatus.COMPLETED,
      transactionId,
      paidAt: new Date(),
    });

    return payment;
  }

  async getMyPayments(userId: string): Promise<IPaymentDocument[]> {
    return paymentRepository.findByUser(userId);
  }

  async getPaymentById(id: string, userId: string): Promise<IPaymentDocument> {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw new NotFoundException("Payment not found");
    if (payment.userId.toString() !== userId) {
      throw new BadRequestException("You do not have access to this payment");
    }
    return payment;
  }

  async refundPayment(paymentId: string, userId: string): Promise<IPaymentDocument> {
    const payment = await this.getPaymentById(paymentId, userId);
    if (payment.status === PaymentStatus.REFUNDED) {
      throw new BadRequestException("Payment is already refunded");
    }
    return paymentRepository.updateStatus(paymentId, PaymentStatus.REFUNDED);
  }
}

export default new PaymentService();