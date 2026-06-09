import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bike_sewa";
export const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const SALT_ROUNDS = 10;

export const CORS_ORIGINS = [
  "http://localhost:3001",
  "http://localhost:3000",
];
