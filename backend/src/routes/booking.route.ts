import { Router } from "express";
import bookingController from "../controllers/booking.controller";
import authorizedMiddleware from "../middlewares/authorized.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

const bookingRouter = Router();

bookingRouter.use(authorizedMiddleware);

// IMPORTANT: Static routes must be declared BEFORE dynamic /:id routes
bookingRouter.get("/me", bookingController.getMyBookings);
bookingRouter.get("/admin/all", adminMiddleware, bookingController.getAllBookings);

bookingRouter.post("/", bookingController.createBooking);
bookingRouter.get("/:id", bookingController.getBookingById);
bookingRouter.post("/:id/cancel", bookingController.cancelBooking);
bookingRouter.post("/:id/complete", bookingController.completeBooking);
bookingRouter.patch("/:id/status", adminMiddleware, bookingController.updateBookingStatus);

export default bookingRouter;