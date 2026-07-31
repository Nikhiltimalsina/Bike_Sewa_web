import { Router } from "express";
import PaymentController from "../controllers/payment.controller";
import authorizedMiddleware from "../middlewares/authorized.middleware";

const paymentRouter = Router();

paymentRouter.use(authorizedMiddleware);

paymentRouter.post("/", PaymentController.processPayment);
paymentRouter.get("/me", PaymentController.getMyPayments);
paymentRouter.get("/:id", PaymentController.getPaymentById);
paymentRouter.post("/:id/refund", PaymentController.refundPayment);

export default paymentRouter;