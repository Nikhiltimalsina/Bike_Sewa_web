import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: object,
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json(data);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500
): Response => {
  return res.status(statusCode).json({ message });
};
