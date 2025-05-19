import { Request, Response, NextFunction } from "express";
import { BaseDto } from "../dtos/base.dto";
import { sendResponse } from "../utils/responseHelper";

/**
 * Middleware to validate request body against a DTO class
 * @param dtoClass - The DTO class to validate against
 * @returns Express middleware function
 */
export const validateDto = (dtoClass: any) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validationResult = await BaseDto.validate(dtoClass, req.body);

      if (!validationResult.isValid || !validationResult.dto) {
        sendResponse(res, 400, "Validation failed", {
          errors: validationResult.errors,
        });
        return;
      }

      // Attach the validated DTO to the request for use in controllers
      req.body = validationResult.dto;
      next();
    } catch (error) {
      sendResponse(res, 500, "Validation error", {
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
};
