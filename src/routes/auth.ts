import { Router } from "express";
import { login, refreshToken, logout } from "../controllers/auth.controller";
import { validateDto } from "../middleware/validationMiddleware";
import { LoginDto, RefreshTokenDto } from "../dtos/auth.dto";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */

// Login to system
router.post("/login", validateDto(LoginDto), login);

// Refresh token
router.post("/refresh-token", validateDto(RefreshTokenDto), refreshToken);

// Logout
router.post("/logout", authenticate, logout);

export default router;
