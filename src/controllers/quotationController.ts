import { Request, Response } from "express";
import quotationService from "../services/quotationService";
import { quotationStatus } from "../models/quotation";
import { sendResponse } from "../utils/responseHelper";
import {
  CreateQuotationDto,
  QuotationDetailDto,
  UpdateQuotationStatusDto,
} from "../dtos/quotation.dto";

/**
 * @swagger
 * /api/quotations/create:
 *   post:
 *     summary: Create a new quotation
 *     tags: [Quotation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuotationDto'
 *     responses:
 *       201:
 *         description: Quotation created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
export const createQuotation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { details, ...quotationData } = req.body as CreateQuotationDto;

    const result = await quotationService.createQuotation(
      quotationData,
      details
    );

    sendResponse(res, 201, "Quotation created successfully", result, {
      action: "Create quotation",
    });
  } catch (error) {
    console.error("Error creating quotation:", error);
    sendResponse(res, 500, "Failed to create quotation", error);
  }
};

/**
 * @swagger
 * /api/quotations/all:
 *   get:
 *     summary: Get all quotations
 *     tags: [Quotation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of quotations
 *       500:
 *         description: Server error
 */
export const getAllQuotations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const quotations = await quotationService.getAllQuotations();

    sendResponse(res, 200, "Quotations retrieved successfully", quotations, {
      action: "Fetch all quotations",
    });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    sendResponse(res, 500, "Failed to fetch quotations", error);
  }
};

/**
 * @swagger
 * /api/quotations/detail:
 *   post:
 *     summary: Get quotation by ID
 *     tags: [Quotation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuotationDetailDto'
 *     responses:
 *       200:
 *         description: Quotation details
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
export const getQuotationDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body as QuotationDetailDto;

    const quotation = await quotationService.getQuotationById(id);

    if (!quotation) {
      sendResponse(res, 404, "Quotation not found");
      return;
    }

    sendResponse(res, 200, "Quotation retrieved successfully", quotation, {
      action: "Fetch quotation details",
    });
  } catch (error) {
    console.error("Error fetching quotation:", error);
    sendResponse(res, 500, "Failed to fetch quotation", error);
  }
};

/**
 * @swagger
 * /api/quotations/update-status:
 *   post:
 *     summary: Update quotation status
 *     tags: [Quotation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuotationStatusDto'
 *     responses:
 *       200:
 *         description: Quotation status updated
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
export const updateQuotationStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, status } = req.body as UpdateQuotationStatusDto;

    const result = await quotationService.updateQuotationStatus(id, status);

    if (!result || result.length === 0) {
      sendResponse(res, 404, "Quotation not found");
      return;
    }

    sendResponse(res, 200, "Quotation status updated successfully", result[0], {
      action: "Update quotation status",
    });
  } catch (error) {
    console.error("Error updating quotation status:", error);
    sendResponse(res, 500, "Failed to update quotation status", error);
  }
};
