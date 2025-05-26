import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger, { logApiError } from "../utils/logger";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
} from "../dtos/user.dto";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const user = await userService.getProfile(userId);

    // Use enhanced response helper with action details
    sendResponse(res, 200, "User profile retrieved successfully", user, {
      action: "Profile retrieval",
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { fullname } = req.body as UpdateUserDto;
    const updatedUser = await userService.editUser(userId, fullname);

    // Use enhanced response helper with action details
    sendResponse(res, 200, "User profile updated successfully", {
      action: "Profile update",
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("required")
      ? 400
      : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, fullname } = req.body as CreateUserDto;
    await userService.createUser(email, password, fullname);

    // Use enhanced response helper with action details
    sendResponse(res, 201, "User created successfully", null, {
      action: "User creation",
    });
  } catch (error: any) {
    const statusCode = error.message.includes("already exists")
      ? 409
      : error.message.includes("required")
      ? 400
      : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};
