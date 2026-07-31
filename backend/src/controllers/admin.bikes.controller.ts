import { Request, Response, NextFunction } from "express";
import BikeModel from "../models/bike.model";
import bikeService from "../services/bike.service";
import { NotFoundException, BadRequestException } from "../exceptions/http-exception";

const toBikeJson = (bike: any) => ({
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

const AdminBikesController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const bikes = await bikeService.getAllBikes();
      res.status(200).json({ bikes: bikes.map(toBikeJson) });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const bike = await bikeService.getBikeById(req.params.id);
      res.status(200).json({ bike: toBikeJson(bike) });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updates = req.body;
      const bike = await bikeService.getBikeById(req.params.id);
      const allowedFields = [
        "name", "modelName", "location", "latitude", "longitude",
        "isAvailable", "pricePerHour", "imageUrl",
      ];
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          (bike as any)[field] = updates[field];
        }
      }
      await bike.save();
      res.status(200).json({ message: "Bike updated successfully", bike: toBikeJson(bike) });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await BikeModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Bike deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default AdminBikesController;