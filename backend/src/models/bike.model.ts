import mongoose, { Schema, Document } from "mongoose";

export interface IBikeDocument extends Document {
   name: string;
   modelName: string;
   location: string;
   latitude: number;
   longitude: number;
   isAvailable: boolean;
   pricePerHour: number;
   imageUrl?: string;
   createdAt: Date;
   updatedAt: Date;
 }

const BikeSchema = new Schema<IBikeDocument>(
   {
     name: {
       type: String,
       required: [true, "Bike name is required"],
       trim: true,
     },
     modelName: {
       type: String,
       required: [true, "Bike model is required"],
       trim: true,
     },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    pricePerHour: {
      type: Number,
      required: [true, "Price per hour is required"],
      min: [0, "Price cannot be negative"],
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BikeModel = mongoose.model<IBikeDocument>("Bike", BikeSchema);

export default BikeModel;