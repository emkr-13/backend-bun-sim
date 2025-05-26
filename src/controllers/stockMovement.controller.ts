import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger, { logApiError } from "../utils/logger";
import { StockMovementRepository } from "../repositories/stockMovement.repository";
import { StockMovementDetailDto } from "../dtos/stockMovement.dto";

// Create repository instance
const stockMovementRepository = new StockMovementRepository();

/**
 * Get stock movement details by ID
 * @route POST /api/stock-movements/detail
 * @param {Request} req - Express request object with stock movement ID in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getStockMovementDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract stock movement ID from request body
    const { id } = req.body as StockMovementDetailDto;

    // Get stock movement details from repository
    const stockMovement = await stockMovementRepository.getStockMovementById(
      id
    );

    // Check if stock movement exists
    if (!stockMovement) {
      throw new Error("Stock movement not found");
    }

    // Send successful response with stock movement details
    sendResponse(
      res,
      200,
      "Stock movement details retrieved successfully",
      stockMovement
    );
  } catch (error: any) {
    // Handle different error types with appropriate status codes
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;

    // Log the error
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);

    // Send error response
    sendResponse(res, statusCode, error.message);
  }
};

/**
 * List stock movements with filtering and pagination
 * @route GET /api/stock-movements/all
 * @param {Request} req - Express request object with query parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export const listStockMovements = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const movementType = req.query.movementType as "in" | "out" | undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string)?.toLowerCase() === "asc" ? "asc" : "desc";

    // Get stock movements from repository
    const result = await stockMovementRepository.listStockMovements({
      page,
      limit,
      search,
      movementType,
      sortBy,
      sortOrder,
    });

    // Format the response with pagination data
    const response = {
      data: result.data,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };

    // Send successful response
    sendResponse(res, 200, "Stock movements retrieved successfully", response);
  } catch (error: any) {
    // Log the error
    logApiError(500, error.message, `${req.baseUrl}${req.path}`, error);

    // Send error response
    sendResponse(res, 500, error.message);
  }
};
