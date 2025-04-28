import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/responseHelper";
import logger from "../utils/logger"; // Import logger

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    sendResponse(res, 401, "Access denied");
    logger.error("Access denied: No token provided");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    logger.error("Invalid token:", error);
    sendResponse(res, 400, "Invalid token",error);
  }
};