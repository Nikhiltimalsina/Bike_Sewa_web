import bikeRepository from "../repositories/bike.repository";
import { NotFoundException, BadRequestException } from "../exceptions/http-exception";
import { IBikeDocument } from "../models/bike.model";

class BikeService {
  async getAllBikes(): Promise<IBikeDocument[]> {
    return bikeRepository.findAll();
  }

  async getAvailableBikes(): Promise<IBikeDocument[]> {
    return bikeRepository.findAvailable();
  }

  async getBikeById(id: string): Promise<IBikeDocument> {
    const bike = await bikeRepository.findById(id);
    if (!bike) throw new NotFoundException("Bike not found");
    return bike;
  }

  async searchBikes(query: string): Promise<IBikeDocument[]> {
    if (!query || query.trim().length === 0) {
      return bikeRepository.findAll();
    }
    return bikeRepository.search(query.trim());
  }

  async getBikesByLocation(location: string): Promise<IBikeDocument[]> {
    if (!location || location.trim().length === 0) {
      throw new BadRequestException("Location is required");
    }
    return bikeRepository.findByLocation(location.trim());
  }

  async rentBike(id: string): Promise<IBikeDocument> {
    const bike = await bikeRepository.findById(id);
    if (!bike) throw new NotFoundException("Bike not found");
    if (!bike.isAvailable) {
      throw new BadRequestException("Bike is already rented");
    }
    const updated = await bikeRepository.setAvailability(id, false);
    return updated as IBikeDocument;
  }

  async returnBike(id: string): Promise<IBikeDocument> {
    const bike = await bikeRepository.findById(id);
    if (!bike) throw new NotFoundException("Bike not found");
    const updated = await bikeRepository.setAvailability(id, true);
    return updated as IBikeDocument;
  }
}

export default new BikeService();