import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "../database/mongodb";
import userRouter from "../routes/user.route";
import { HttpException } from "../exceptions/http-exception";
import { PORT, CORS_ORIGINS } from "../configs/constant";

const app = express();

// ── Middlewares ──────────────────────────────────────────────
app.use(
  cors({
    origin: CORS_ORIGINS,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────
app.use("/auth", userRouter);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "🚲 Bike Sewa API is running" });
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error("Unexpected error:", err);
  return res.status(500).json({ message: "Internal server error" });
});

// ── Start ────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚲 Bike Sewa Backend running on http://localhost:${PORT}`);
  });
});

export default app;
