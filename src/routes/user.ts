import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/user.controller";
import { validateDto } from "../middleware/validationMiddleware";
import { ChangePasswordDto, UpdateUserDto } from "../dtos/user.dto";

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */
const router = Router();

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
router.get("/profile", getUserProfile);

/**
 * @swagger
 * /api/user/update:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
router.post("/update", validateDto(UpdateUserDto), updateUserProfile);

/**
 * @swagger
 * /api/user/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
router.post("/change-password", validateDto(ChangePasswordDto), changePassword);

export default router;
