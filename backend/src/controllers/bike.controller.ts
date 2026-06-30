import { Request, Response, NextFunction } from "express";
import bikeService from "../services/bike.service";
import { IBikeDocument } from "../models/bike.model";

const toBikeJson = (bike: IBikeDocument) => ({
   id: bike._id.toString(),
   name: bike.name,
   model: bike.modelName,
   location: bike.location,
   latitude: bike.latitude,
   longitude: bike.longitude,
   isAvailable: bike.isAvailable,
   pricePerHour: bike.pricePerHour,
   imageUrl: bike.imageUrl ?? null,
 });

class BikeController {
  async getAllBikes(req: Request, res: Response, next: NextFunction) {
    try {
      const onlyAvailable = req.query.available === "true";
      const bikes = onlyAvailable
        ? await bikeService.getAvailableBikes()
        : await bikeService.getAllBikes();

      res.status(200).json({ bikes: bikes.map(toBikeJson) });
    } catch (error) {
      next(error);
    }
  }

  async searchBikes(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q as string) || "";
      const bikes = await bikeService.searchBikes(query);
      res.status(200).json({ bikes: bikes.map(toBikeJson) });
    } catch (error) {
      next(error);
    }
  }

  async getBikesByLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const location = (req.query.location as string) || "";
      const bikes = await bikeService.getBikesByLocation(location);
      res.status(200).json({ bikes: bikes.map(toBikeJson) });
    } catch (error) {
      next(error);
    }
  }

  async getBikeById(req: Request, res: Response, next: NextFunction) {
    try {
      const bike = await bikeService.getBikeById(req.params.id);
      res.status(200).json({ bike: toBikeJson(bike) });
    } catch (error) {
      next(error);
    }
  }

  async rentBike(req: Request, res: Response, next: NextFunction) {
    try {
      const bike = await bikeService.rentBike(req.params.id);
      res.status(200).json({ message: "Bike rented successfully", bike: toBikeJson(bike) });
    } catch (error) {
      next(error);
    }
  }

  async returnBike(req: Request, res: Response, next: NextFunction) {
    try {
      const bike = await bikeService.returnBike(req.params.id);
      res.status(200).json({ message: "Bike returned successfully", bike: toBikeJson(bike) });
    } catch (error) {
      next(error);
    }
  }
}

export default new BikeController();