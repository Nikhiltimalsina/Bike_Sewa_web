import dotenv from "dotenv";
dotenv.config();

import connectDB from "../database/mongodb";
import BikeModel from "../models/bike.model";

const sampleBikes = [
  {
    name: "KTM Duke 390",
    modelName: "Sport",
    location: "Thamel, Kathmandu",
    latitude: 27.7154,
    longitude: 85.31,
    isAvailable: true,
    pricePerHour: 3200,
    imageUrl: "http://localhost:3000/images/duke390.webp",
  },
  {
    name: "KTM Duke 250",
    modelName: "Sport",
    location: "Lakeside, Pokhara",
    latitude: 28.2096,
    longitude: 83.9856,
    isAvailable: true,
    pricePerHour: 2500,
    imageUrl: "http://localhost:3000/images/duke250.jpeg",
  },
  {
    name: "Yamaha R15 V3",
    modelName: "Sport",
    location: "Patan, Lalitpur",
    latitude: 27.6727,
    longitude: 85.3247,
    isAvailable: true,
    pricePerHour: 2200,
    imageUrl: "http://localhost:3000/images/r15v3.webp",
  },
  {
    name: "Yamaha MT-15",
    modelName: "Naked",
    location: "Boudha, Kathmandu",
    latitude: 27.7215,
    longitude: 85.3619,
    isAvailable: true,
    pricePerHour: 2400,
    imageUrl: "http://localhost:3000/images/mt15.jpeg",
  },
  {
    name: "Royal Enfield Classic 350",
    modelName: "Cruiser",
    location: "Thamel, Kathmandu",
    latitude: 27.7135,
    longitude: 85.3125,
    isAvailable: true,
    pricePerHour: 2800,
    imageUrl: "http://localhost:3000/images/royal%20enfield.avif",
  },
  {
    name: "Bajaj Pulsar 220",
    modelName: "Sport",
    location: "Baneshwor, Kathmandu",
    latitude: 27.6935,
    longitude: 85.3305,
    isAvailable: true,
    pricePerHour: 2000,
    imageUrl: "http://localhost:3000/images/pulsar220.avif",
  },
  {
    name: "Honda Shine",
    modelName: "Commuter",
    location: "Patan, Lalitpur",
    latitude: 27.6715,
    longitude: 85.3255,
    isAvailable: true,
    pricePerHour: 1500,
    imageUrl: "http://localhost:3000/images/honda%20shine.jpeg",
  },
  {
    name: "TVS Apache RTR 160",
    modelName: "Sport",
    location: "Pokhara, Lakeside",
    latitude: 28.2105,
    longitude: 83.9845,
    isAvailable: true,
    pricePerHour: 1800,
    imageUrl: "http://localhost:3000/images/xtreme.avif",
  },
  {
    name: "Hero Xtreme 200",
    modelName: "Naked",
    location: "Chitwan, Bharatpur",
    latitude: 27.6825,
    longitude: 84.4325,
    isAvailable: false,
    pricePerHour: 1900,
    imageUrl: "http://localhost:3000/images/xtreme.avif",
  },
  {
    name: "Hero Xpulse 200",
    modelName: "Adventure",
    location: "Boudha, Kathmandu",
    latitude: 27.7225,
    longitude: 85.3625,
    isAvailable: true,
    pricePerHour: 2100,
    imageUrl: "http://localhost:3000/images/xpulse.cms",
  },
  {
    name: "Bajaj Discover 125",
    modelName: "Commuter",
    location: "Maitighar, Kathmandu",
    latitude: 27.6995,
    longitude: 85.3195,
    isAvailable: true,
    pricePerHour: 1200,
    imageUrl: "http://localhost:3000/images/discover.avif",
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