import { Request, Response, NextFunction } from "express";
import paymentService from "../services/payment.service";
import { BadRequestException, NotFoundException } from "../exceptions/http-exception";

const toPaymentJson = (payment: any) => {
  return {
    id: payment._id.toString(),
    bookingId: payment.bookingId._id
      ? payment.bookingId._id.toString()
      : payment.bookingId.toString(),
    userId: payment.userId._id
      ? payment.userId._id.toString()
      : payment.userId.toString(),
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    transactionId: payment.transactionId,
    paidAt: payment.paidAt,
    receiptUrl: payment.receiptUrl ?? null,
  };
};

const PaymentController = {
  async processPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { bookingId, amount, method } = req.body;

      if (!bookingId || !amount || !method) {
        throw new BadRequestException(
          "bookingId, amount, and method are required"
        );
      }

      const payment = await paymentService.processPayment(
        userId,
        bookingId,
        amount,
        method
      );

      res.status(201).json({
        message: "Payment processed successfully",
        payment: toPaymentJson(payment),
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const payments = await paymentService.getMyPayments(userId);
      res.status(200).json({ payments: payments.map(toPaymentJson) });
    } catch (error) {
      next(error);
    }
  },

  async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const payment = await paymentService.getPaymentById(
        req.params.id,
        userId
      );
      res.status(200).json({ payment: toPaymentJson(payment) });
    } catch (error) {
      next(error);
    }
  },

  async refundPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const payment = await paymentService.refundPayment(
        req.params.id,
        userId
      );
      res.status(200).json({
        message: "Payment refunded successfully",
        payment: toPaymentJson(payment),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default PaymentController;