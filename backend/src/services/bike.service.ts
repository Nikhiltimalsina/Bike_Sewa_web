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

  // === Admin Methods ===

  async createBike(data: {
    name: string;
    modelName: string;
    location: string;
    latitude: number;
    longitude: number;
    pricePerHour: number;
    imageUrl?: string;
  }): Promise<IBikeDocument> {
    return bikeRepository.create(data);
  }

  async updateBike(id: string, data: Partial<{
    name: string;
    modelName: string;
    location: string;
    latitude: number;
    longitude: number;
    pricePerHour: number;
    imageUrl: string;
    isAvailable: boolean;
  }>): Promise<IBikeDocument> {
    const updated = await bikeRepository.updateById(id, data);
    if (!updated) throw new NotFoundException("Bike not found");
    return updated;
  }

  async deleteBike(id: string): Promise<void> {
    const deleted = await bikeRepository.deleteById(id);
    if (!deleted) throw new NotFoundException("Bike not found");
  }
}

export default new BikeService();