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
 * tags:
 *   name: User
 *   description: User management endpoints
 */

// Get user profile
router.get("/profile", authenticate, getUserProfile);

// Update user profile
router.post(
  "/update",
  authenticate,
  validateDto(UpdateUserDto),
  updateUserProfile
);

// Create a new user
router.post("/create", authenticate, validateDto(CreateUserDto), createUser);

export default router;
