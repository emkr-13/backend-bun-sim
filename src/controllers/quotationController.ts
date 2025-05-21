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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for quotation number, customer name, or store name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, sent, accepted, rejected, expired, converted]
 *         description: Filter by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [quotationNumber, quotationDate, grandTotal, status, createdAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const status = req.query.status as
      | (typeof quotationStatus.enumValues)[number]
      | undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    // Validate sortBy field
    const validSortFields = [
      "quotationNumber",
      "quotationDate",
      "grandTotal",
      "status",
      "createdAt",
    ];
    if (sortBy && !validSortFields.includes(sortBy)) {
      sendResponse(
        res,
        400,
        `Invalid sortBy field. Must be one of: ${validSortFields.join(", ")}`
      );
      return;
    }

    // Validate sortOrder
    if (sortOrder && !["asc", "desc"].includes(sortOrder)) {
      sendResponse(res, 400, "Invalid sortOrder. Must be 'asc' or 'desc'");
      return;
    }

    // Validate status if provided
    if (status && !quotationStatus.enumValues.includes(status)) {
      sendResponse(
        res,
        400,
        `Invalid status. Must be one of: ${quotationStatus.enumValues.join(
          ", "
        )}`
      );
      return;
    }

    const result = await quotationService.getAllQuotations({
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder,
    });

    sendResponse(res, 200, "Quotations retrieved successfully", result, {
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
 *         description: Invalid status or cannot update status due to business rules
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

    try {
      const result = await quotationService.updateQuotationStatus(id, status);

      sendResponse(
        res,
        200,
        "Quotation status updated successfully",
        result[0],
        {
          action: "Update quotation status",
        }
      );
    } catch (error: any) {
      if (error.message.includes("already been accepted")) {
        sendResponse(res, 400, error.message);
        return;
      }

      if (error.message.includes("not found")) {
        sendResponse(res, 404, "Quotation not found");
        return;
      }

      throw error; // Re-throw for the outer catch
    }
  } catch (error) {
    console.error("Error updating quotation status:", error);
    sendResponse(res, 500, "Failed to update quotation status", error);
  }
};
