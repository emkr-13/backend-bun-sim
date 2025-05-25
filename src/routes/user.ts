import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  createUser,
} from "../controllers/user.controller";
import { validateDto } from "../middleware/validationMiddleware";
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
} from "../dtos/user.dto";
import { authenticate } from "../middleware/authMiddleware";

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
router.get("/profile", authenticate, getUserProfile);

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
router.post(
  "/update",
  authenticate,
  validateDto(UpdateUserDto),
  updateUserProfile
);

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
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: User with this email already exists
 *       500:
 *         description: Server error
 */
router.post("/create", authenticate, validateDto(CreateUserDto), createUser);

export default router;
