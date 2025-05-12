import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger from "../utils/logger";
import { AuthService } from "../services/auth.service";
import { AuthRepository } from "../repositories/auth.repository";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendResponse(res, 200, "Login successful", result);
  } catch (error: any) {
    logger.error("Error during login:", error);
    const statusCode = error.message.includes("credentials")
      ? 401
      : error.message.includes("required")
      ? 400
      : 500;
    sendResponse(res, statusCode, error.message);
  }
};
