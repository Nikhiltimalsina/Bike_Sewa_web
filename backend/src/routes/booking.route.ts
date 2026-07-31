import { Router } from "express";
import BookingController from "../controllers/booking.controller";
import authorizedMiddleware from "../middlewares/authorized.middleware";

const bookingRouter = Router();

bookingRouter.use(authorizedMiddleware);

bookingRouter.post("/", BookingController.createBooking);
bookingRouter.get("/me", BookingController.getMyBookings);
bookingRouter.get("/:id", BookingController.getBookingById);
bookingRouter.patch("/:id/cancel", BookingController.cancelBooking);
bookingRouter.patch("/:id/complete", BookingController.completeBooking);

export default bookingRouter;