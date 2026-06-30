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
}

export default new BikeRepository();