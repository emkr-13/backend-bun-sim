import { Request, Response } from "express";
import { ReportService } from "../services/report.service";
import { sendResponse } from "../utils/responseHelper";
import { DateFilterType, ReportFilterDto } from "../dtos/report.dto";
import logger from "../utils/logger";

const reportService = new ReportService();

export const generateQuotationsPdfReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { filterType, startDate, endDate, title } =
      req.body as ReportFilterDto;

    logger.info(`Generating quotations PDF report with filter: ${filterType}`);
    logger.info(
      `Parameters: startDate=${startDate}, endDate=${endDate}, title=${title}`
    );

    // Validate custom dates if needed
    if (filterType === DateFilterType.CUSTOM && (!startDate || !endDate)) {
      logger.warn("Missing required dates for custom filter");
      sendResponse(
        res,
        400,
        "Start date and end date are required for custom date range"
      );
      return;
    }

    // Generate report data
    try {
      const reportData = await reportService.generateQuotationsReport({
        filterType,
        startDate,
        endDate,
        title,
      });

      logger.info(
        `Successfully generated quotations report with ${reportData.data.length} records`
      );

      // Generate PDF
      const doc = reportService.generateQuotationReportPdf(reportData, {
        title: title || "Quotations Report",
      });

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=quotations-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      // Pipe the PDF to the response
      doc.pipe(res);
      doc.end();
    } catch (err) {
      logger.error("Error in report generation stage:", err);
      throw err;
    }
  } catch (error) {
    logger.error("Error generating quotations PDF report:", error);

    if (error instanceof Error) {
      sendResponse(
        res,
        500,
        `Failed to generate report: ${error.message}`,
        error
      );
    } else {
      sendResponse(
        res,
        500,
        "Failed to generate report due to an unknown error",
        error
      );
    }
  }
};

export const generatePurchasesPdfReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { filterType, startDate, endDate, title } =
      req.body as ReportFilterDto;

    logger.info(`Generating purchases PDF report with filter: ${filterType}`);
    logger.info(
      `Parameters: startDate=${startDate}, endDate=${endDate}, title=${title}`
    );

    // Validate custom dates if needed
    if (filterType === DateFilterType.CUSTOM && (!startDate || !endDate)) {
      logger.warn("Missing required dates for custom filter");
      sendResponse(
        res,
        400,
        "Start date and end date are required for custom date range"
      );
      return;
    }

    // Generate report data
    try {
      const reportData = await reportService.generatePurchasesReport({
        filterType,
        startDate,
        endDate,
        title,
      });

      logger.info(
        `Successfully generated purchases report with ${reportData.data.length} records`
      );

      // Generate PDF
      const doc = reportService.generatePurchaseReportPdf(reportData, {
        title: title || "Purchases Report",
      });

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=purchases-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      // Pipe the PDF to the response
      doc.pipe(res);
      doc.end();
    } catch (err) {
      logger.error("Error in report generation stage:", err);
      throw err;
    }
  } catch (error) {
    logger.error("Error generating purchases PDF report:", error);

    if (error instanceof Error) {
      sendResponse(
        res,
        500,
        `Failed to generate report: ${error.message}`,
        error
      );
    } else {
      sendResponse(
        res,
        500,
        "Failed to generate report due to an unknown error",
        error
      );
    }
  }
};

export const generateCombinedPdfReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { filterType, startDate, endDate, title } =
      req.body as ReportFilterDto;

    logger.info(`Generating combined PDF report with filter: ${filterType}`);
    logger.info(
      `Parameters: startDate=${startDate}, endDate=${endDate}, title=${title}`
    );

    // Validate custom dates if needed
    if (filterType === DateFilterType.CUSTOM && (!startDate || !endDate)) {
      logger.warn("Missing required dates for custom filter");
      sendResponse(
        res,
        400,
        "Start date and end date are required for custom date range"
      );
      return;
    }

    // Generate report data
    try {
      const reportData = await reportService.generateCombinedReport({
        filterType,
        startDate,
        endDate,
        title,
      });

      logger.info(
        `Successfully generated combined report with ${reportData.quotations.data.length} quotations and ${reportData.purchases.data.length} purchases`
      );

      // Generate PDF
      const doc = reportService.generateCombinedReportPdf(reportData, {
        title: title || "Combined Financial Report",
      });

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=combined-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      // Pipe the PDF to the response
      doc.pipe(res);
      doc.end();
    } catch (err) {
      logger.error("Error in report generation stage:", err);
      throw err;
    }
  } catch (error) {
    logger.error("Error generating combined PDF report:", error);

    if (error instanceof Error) {
      sendResponse(
        res,
        500,
        `Failed to generate report: ${error.message}`,
        error
      );
    } else {
      sendResponse(
        res,
        500,
        "Failed to generate report due to an unknown error",
        error
      );
    }
  }
};
