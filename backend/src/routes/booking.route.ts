import { Router } from "express";
import bookingController from "../controllers/booking.controller";
import authorizedMiddleware from "../middlewares/authorized.middleware";

const bookingRouter = Router();

bookingRouter.use(authorizedMiddleware);

bookingRouter.post("/", bookingController.createBooking);
bookingRouter.get("/me", bookingController.getMyBookings);
bookingRouter.get("/:id", bookingController.getBookingById);
bookingRouter.post("/:id/cancel", bookingController.cancelBooking);

export default bookingRouter;