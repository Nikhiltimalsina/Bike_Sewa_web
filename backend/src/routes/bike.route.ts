import { Router } from "express";
import bikeController from "../controllers/bike.controller";
import authorizedMiddleware from "../middlewares/authorized.middleware";

const bikeRouter = Router();

bikeRouter.get("/", bikeController.getAllBikes);
bikeRouter.get("/search", bikeController.searchBikes);
bikeRouter.get("/location", bikeController.getBikesByLocation);
bikeRouter.get("/:id", bikeController.getBikeById);
bikeRouter.post("/:id/rent", authorizedMiddleware, bikeController.rentBike);
bikeRouter.post("/:id/return", authorizedMiddleware, bikeController.returnBike);

export default bikeRouter;