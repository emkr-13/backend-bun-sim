import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger, { logApiError } from "../utils/logger";
import { AuthService } from "../services/auth.service";
import { AuthRepository } from "../repositories/auth.repository";
import { LoginDto, RefreshTokenDto } from "../dtos/auth.dto";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the system
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   properties:
 *                     token:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginDto;
    const result = await authService.login(email, password);

    // Use enhanced response helper with action details
    sendResponse(res, 200, "Login successful", result, {
      action: "User authentication",
    });
  } catch (error: any) {
    const statusCode = error.message.includes("credentials")
      ? 401
      : error.message.includes("required")
      ? 400
      : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenDto'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
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
 *                   properties:
 *                     token:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Invalid refresh token
 *       401:
 *         description: Refresh token expired
 *       500:
 *         description: Server error
 */
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body as RefreshTokenDto;
    const result = await authService.refreshToken(token);

    // Use enhanced response helper with action details
    sendResponse(res, 200, "Token refreshed successfully", result, {
      action: "Token refresh",
    });
  } catch (error: any) {
    const statusCode =
      error.message.includes("expired") || error.message.includes("invalid")
        ? 401
        : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // TypeScript doesn't recognize req.user because it's added by middleware
    // Use type assertion to access it
    const userId = (req as any).user?.id;
    await authService.logout(userId);

    // Use enhanced response helper with action details
    sendResponse(res, 200, "Logged out successfully", null, {
      action: "User logout",
    });
  } catch (error: any) {
    logApiError(500, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, 500, error.message);
  }
};
