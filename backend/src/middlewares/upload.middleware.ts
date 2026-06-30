import fs from "fs";
import path from "path";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { UPLOAD_DIR, AVATAR_DIR } from "../configs/constant";
import { BadRequestException } from "../exceptions/http-exception";

const avatarDirPath = path.join(process.cwd(), UPLOAD_DIR, AVATAR_DIR);

// Ensure upload directory exists
if (!fs.existsSync(avatarDirPath)) {
  fs.mkdirSync(avatarDirPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, avatarDirPath);
  },
  filename: (req: Request, file, cb) => {
    const userId = req.user?.userId || "anonymous";
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${userId}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new BadRequestException("Only JPG, PNG, and WEBP images are allowed"));
    return;
  }
  cb(null, true);
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default uploadAvatar;