import { Router } from "express";
import AdminBookingsController from "../controllers/admin.bookings.controller";
import authorizedMiddleware from "../middlewares/authorized.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

const adminBookingsRouter = Router();

adminBookingsRouter.use(authorizedMiddleware);
adminBookingsRouter.use(adminMiddleware);

adminBookingsRouter.get("/", AdminBookingsController.getAll);
adminBookingsRouter.patch("/:id/status", AdminBookingsController.updateStatus);

export default adminBookingsRouter;