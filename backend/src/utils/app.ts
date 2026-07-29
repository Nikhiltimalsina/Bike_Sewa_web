import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

import connectDB from "../database/mongodb";
import userRouter from "../routes/user.route";
import bikeRouter from "../routes/bike.route";
import bookingRouter from "../routes/booking.route";
import { HttpException } from "../exceptions/http-exception";
import blogRouter from "../routes/blog.route";
import { PORT, CORS_ORIGINS, UPLOAD_DIR } from "../configs/constant";

const app = express();

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

// Serve uploaded files (e.g. avatars) statically
app.use(`/${UPLOAD_DIR}`, express.static(path.join(process.cwd(), UPLOAD_DIR)));

app.use("/auth", userRouter);
app.use("/bikes", bikeRouter);
app.use("/bookings", bookingRouter);
app.use("/blogs", blogRouter);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "🚲 Bike Sewa API is running" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error("Unexpected error:", err);
  return res.status(500).json({ message: "Internal server error" });
});

const port = Number(PORT) || 3001;

connectDB().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`🚲 Bike Sewa Backend running on http://0.0.0.0:${port}`);
  });
});

export default app;