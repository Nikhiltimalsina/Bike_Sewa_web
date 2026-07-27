import dotenv from "dotenv";
import path from "path";

// Explicitly resolve the .env path from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config();

export const PORT = process.env.PORT || 3001;
export const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/bike_sewa";

// Set default fallback secret to MATCH your .env key exactly
export const JWT_SECRET =
  process.env.JWT_SECRET || "bike_sewa_super_secret_key_change_in_production";

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const SALT_ROUNDS = 10;

export const UPLOAD_DIR = "uploads";
export const AVATAR_DIR = "avatars";
export const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

export const CORS_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
];

// Social login OAuth client IDs
// Google: Create credentials at https://console.cloud.google.com/apis/credentials (Web Client)
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

// Apple: Configure at https://developer.apple.com/account/resources/services/signinwithapple
export const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID || "";
