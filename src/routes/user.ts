import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller";
import { validateDto } from "../middleware/validationMiddleware";
import { ChangePasswordDto, UpdateUserDto } from "../dtos/user.dto";

const router = Router();

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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/profile", getUserProfile);

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
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/update", validateDto(UpdateUserDto), updateUserProfile);

export default router;
