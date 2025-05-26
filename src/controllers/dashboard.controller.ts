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
