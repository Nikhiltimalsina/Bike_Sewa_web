import BikeModel, { IBikeDocument } from "../models/bike.model";

class BikeRepository {
  async findAll(): Promise<IBikeDocument[]> {
    return BikeModel.find().sort({ createdAt: -1 });
  }

  async findAvailable(): Promise<IBikeDocument[]> {
    return BikeModel.find({ isAvailable: true }).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IBikeDocument | null> {
    return BikeModel.findById(id);
  }

  async search(query: string): Promise<IBikeDocument[]> {
     const regex = new RegExp(query, "i");
     return BikeModel.find({
       $or: [{ name: regex }, { modelName: regex }, { location: regex }],
     }).sort({ createdAt: -1 });
   }

  async findByLocation(location: string): Promise<IBikeDocument[]> {
    const regex = new RegExp(location, "i");
    return BikeModel.find({ location: regex }).sort({ createdAt: -1 });
  }

  async setAvailability(
    id: string,
    isAvailable: boolean
  ): Promise<IBikeDocument | null> {
    return BikeModel.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );
  }

  async create(data: {
    name: string;
    modelName: string;
    location: string;
    latitude: number;
    longitude: number;
    pricePerHour: number;
    imageUrl?: string;
  }): Promise<IBikeDocument> {
    return BikeModel.create(data);
  }

  async updateById(
    id: string,
    data: Partial<{
      name: string;
      modelName: string;
      location: string;
      latitude: number;
      longitude: number;
      pricePerHour: number;
      imageUrl: string;
      isAvailable: boolean;
    }>
  ): Promise<IBikeDocument | null> {
    return BikeModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id: string): Promise<IBikeDocument | null> {
    return BikeModel.findByIdAndDelete(id);
  }

  async countDocuments(): Promise<number> {
    return BikeModel.countDocuments();
  }
}

export default new BikeRepository();