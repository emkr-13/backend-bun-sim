import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger from "../utils/logger";
import { UserService } from "../services/userService";
import { UserRepository } from "../repositories/userRepository";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const profile = await userService.getProfile(userId);
    sendResponse(res, 200, "User profile retrieved successfully", profile);
    logger.info("User profile retrieved successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("Unauthorized") ? 401 : 
                      error.message.includes("not found") ? 404 : 500;
    logger.error("Error retrieving profile:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { fullname } = req.body;
    
    await userService.editUser(userId, fullname);
    sendResponse(res, 200, "User updated successfully");
    logger.info("User updated successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("Unauthorized") ? 401 : 
                      error.message.includes("required") ? 400 : 
                      error.message.includes("not found") ? 404 : 500;
    logger.error("Error editing user:", error);
    sendResponse(res, statusCode, error.message);
  }
};