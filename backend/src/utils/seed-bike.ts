import dotenv from "dotenv";
dotenv.config();

import connectDB from "../database/mongodb";
import BikeModel from "../models/bike.model";

const sampleBikes = [
  {
    name: "Harley Davidson Iron 883",
    modelName: "883 CC | Abs Enabled",
    location: "Thamel, Kathmandu",
    latitude: 27.7154,
    longitude: 85.31,
    isAvailable: true,
    pricePerHour: 4500,
    imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800",
  },
  {
    name: "KTM Duke 390",
    modelName: "390 CC | Sport",
    location: "Lakeside, Pokhara",
    latitude: 28.2096,
    longitude: 83.9856,
    isAvailable: true,
    pricePerHour: 3200,
    imageUrl: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=800",
  },
  {
    name: "Vespa SXL 150",
    modelName: "150 CC | Scooter",
    location: "Patan, Lalitpur",
    latitude: 27.6727,
    longitude: 85.3247,
    isAvailable: true,
    pricePerHour: 1800,
    imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800",
  },
  {
    name: "Royal Enfield Classic 350",
    modelName: "350 CC | Cruiser",
    location: "Boudha, Kathmandu",
    latitude: 27.7215,
    longitude: 85.3619,
    isAvailable: false,
    pricePerHour: 2800,
    imageUrl: "https://images.unsplash.com/photo-1622185135505-2d795003994a?w=800",
  },
];

async function seed() {
  await connectDB();
  await BikeModel.deleteMany({});
  await BikeModel.insertMany(sampleBikes);
  console.log(`✅ Seeded ${sampleBikes.length} bikes`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});