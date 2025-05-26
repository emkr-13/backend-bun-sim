import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import { logApiError } from "../utils/logger";
import { DashboardService } from "../services/dashboard.service";
import { DashboardRepository } from "../repositories/dashboard.repository";
import {
  SummarySpecificFilterDto,
  TimeFilterType,
} from "../dtos/dashboard.dto";

const dashboardRepository = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepository);

/**
 * @swagger
 * /api/dashboard/summary-general:
 *   get:
 *     summary: Get general summary data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: General summary data retrieved successfully
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
 *                   $ref: '#/components/schemas/SummaryGeneralDto'
 *       500:
 *         description: Server error
 */
export const getSummaryGeneral = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const summaryData = await dashboardService.getSummaryGeneral();
    sendResponse(
      res,
      200,
      "General summary data retrieved successfully",
      summaryData
    );
  } catch (error: any) {
    const statusCode = 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

/**
 * @swagger
 * /api/dashboard/summary-specific:
 *   get:
 *     summary: Get specific summary data with time filters
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: time_filter
 *         schema:
 *           type: string
 *           enum: [today, last_week, last_two_weeks, this_month]
 *         description: Time filter for summary data
 *     responses:
 *       200:
 *         description: Specific summary data retrieved successfully
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
 *                   $ref: '#/components/schemas/SummarySpecificDto'
 *       400:
 *         description: Invalid filter
 *       500:
 *         description: Server error
 */
export const getSummarySpecific = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { time_filter } = req.query as unknown as SummarySpecificFilterDto;

    // Validate the time_filter if provided
    if (
      time_filter &&
      !["today", "last_week", "last_two_weeks", "this_month"].includes(
        time_filter
      )
    ) {
      sendResponse(
        res,
        400,
        "Invalid time filter. Must be one of: today, last_week, last_two_weeks, this_month"
      );
      return;
    }

    const summaryData = await dashboardService.getSummarySpecific(
      time_filter as TimeFilterType
    );
    sendResponse(
      res,
      200,
      "Specific summary data retrieved successfully",
      summaryData
    );
  } catch (error: any) {
    const statusCode = error.message.includes("Invalid") ? 400 : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};
