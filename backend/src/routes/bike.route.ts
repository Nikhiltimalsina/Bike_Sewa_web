import { Router } from "express";
import bikeController from "../controllers/bike.controller";
import authorizedMiddleware from "../middlewares/authorized.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

const bikeRouter = Router();

// Public routes
bikeRouter.get("/", bikeController.getAllBikes);
bikeRouter.get("/search", bikeController.searchBikes);
bikeRouter.get("/location", bikeController.getBikesByLocation);
bikeRouter.get("/:id", bikeController.getBikeById);

// Protected routes (authenticated users)
bikeRouter.post("/:id/rent", authorizedMiddleware, bikeController.rentBike);
bikeRouter.post("/:id/return", authorizedMiddleware, bikeController.returnBike);

// Admin routes
bikeRouter.post("/", authorizedMiddleware, adminMiddleware, bikeController.adminCreateBike);
bikeRouter.put("/:id", authorizedMiddleware, adminMiddleware, bikeController.adminUpdateBike);
bikeRouter.delete("/:id", authorizedMiddleware, adminMiddleware, bikeController.adminDeleteBike);

export default bikeRouter;