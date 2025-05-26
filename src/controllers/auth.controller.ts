import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger, { logApiError } from "../utils/logger";
import { AuthService } from "../services/auth.service";
import { AuthRepository } from "../repositories/auth.repository";
import { LoginDto, RefreshTokenDto } from "../dtos/auth.dto";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

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
