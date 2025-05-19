import { Router } from "express";
import {
  login,
  register,
  refreshToken,
  logout,
} from "../controllers/auth.controller";
import { validateDto } from "../middleware/validationMiddleware";
import { LoginDto, RefreshTokenDto, RegisterDto } from "../dtos/auth.dto";
import { authenticate } from "../middleware/authMiddleware";

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */
const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the system
 *     tags: [Authentication]
 */
router.post("/login", validateDto(LoginDto), login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 */
router.post("/register", validateDto(RegisterDto), register);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 */
router.post("/refresh-token", validateDto(RefreshTokenDto), refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.post("/logout", authenticate, logout);

export default router;
