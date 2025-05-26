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

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserProfileDto'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/user/update:
 *   post:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/user/create:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: User with this email already exists
 *       500:
 *         description: Server error
 */
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
