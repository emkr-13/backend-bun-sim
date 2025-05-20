import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger from "../utils/logger";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { ChangePasswordDto, UpdateUserDto } from "../dtos/user.dto";

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
    sendResponse(res, 200, "User profile retrieved successfully", user);
  } catch (error: any) {
    logger.error("Error retrieving user profile:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
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
 *                   $ref: '#/components/schemas/UserProfileDto'
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
    sendResponse(res, 200, "User profile updated successfully", updatedUser);
  } catch (error: any) {
    logger.error("Error updating user profile:", error);
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("required")
      ? 400
      : 500;
    sendResponse(res, statusCode, error.message);
  }
};

