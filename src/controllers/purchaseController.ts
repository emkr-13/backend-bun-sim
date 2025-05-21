import { Request, Response } from "express";
import purchaseService from "../services/purchaseService";
import { purchaseStatus } from "../models/purchase";
import { sendResponse } from "../utils/responseHelper";
import {
  CreatePurchaseDto,
  PurchaseDetailDto,
  UpdatePurchaseStatusDto,
} from "../dtos/purchase.dto";

/**
 * @swagger
 * /api/purchases/create:
 *   post:
 *     summary: Create a new purchase
 *     tags: [Purchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePurchaseDto'
 *     responses:
 *       201:
 *         description: Purchase created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
export const createPurchase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { details, ...purchaseData } = req.body as CreatePurchaseDto;

    const result = await purchaseService.createPurchase(purchaseData, details);

    sendResponse(res, 201, "Purchase created successfully", result, {
      action: "Create purchase",
    });
  } catch (error) {
    console.error("Error creating purchase:", error);
    sendResponse(res, 500, "Failed to create purchase", error);
  }
};

/**
 * @swagger
 * /api/purchases/all:
 *   get:
 *     summary: Get all purchases
 *     tags: [Purchase]
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
 *         description: Search term for invoice number, supplier name, or store name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, ordered, received, cancelled, paid]
 *         description: Filter by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [invoiceNumber, purchaseDate, grandTotal, status, createdAt]
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
 *         description: List of purchases
 *       500:
 *         description: Server error
 */
export const getAllPurchases = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const status = req.query.status as
      | (typeof purchaseStatus.enumValues)[number]
      | undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    // Validate sortBy field
    const validSortFields = [
      "invoiceNumber",
      "purchaseDate",
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
    if (status && !purchaseStatus.enumValues.includes(status)) {
      sendResponse(
        res,
        400,
        `Invalid status. Must be one of: ${purchaseStatus.enumValues.join(
          ", "
        )}`
      );
      return;
    }

    const result = await purchaseService.getAllPurchases({
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder,
    });

    sendResponse(res, 200, "Purchases retrieved successfully", result, {
      action: "Fetch all purchases",
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    sendResponse(res, 500, "Failed to fetch purchases", error);
  }
};

/**
 * @swagger
 * /api/purchases/detail:
 *   post:
 *     summary: Get purchase by ID
 *     tags: [Purchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseDetailDto'
 *     responses:
 *       200:
 *         description: Purchase details
 *       404:
 *         description: Purchase not found
 *       500:
 *         description: Server error
 */
export const getPurchaseDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body as PurchaseDetailDto;

    const purchase = await purchaseService.getPurchaseById(id);

    if (!purchase) {
      sendResponse(res, 404, "Purchase not found");
      return;
    }

    sendResponse(res, 200, "Purchase retrieved successfully", purchase, {
      action: "Fetch purchase details",
    });
  } catch (error) {
    console.error("Error fetching purchase:", error);
    sendResponse(res, 500, "Failed to fetch purchase", error);
  }
};

/**
 * @swagger
 * /api/purchases/update-status:
 *   post:
 *     summary: Update purchase status
 *     tags: [Purchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePurchaseStatusDto'
 *     responses:
 *       200:
 *         description: Purchase status updated
 *       400:
 *         description: Invalid status or cannot update status due to business rules
 *       404:
 *         description: Purchase not found
 *       500:
 *         description: Server error
 */
export const updatePurchaseStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, status } = req.body as UpdatePurchaseStatusDto;

    try {
      const result = await purchaseService.updatePurchaseStatus(id, status);

      // For received purchases, include additional information in the response
      if (status === "received") {
        const updatedPurchase = await purchaseService.getPurchaseById(id);

        sendResponse(
          res,
          200,
          "Purchase received and stock updated successfully",
          {
            purchase: result[0],
            details: updatedPurchase?.details || [],
            message:
              "Stock has been automatically increased for all products in this purchase",
          },
          {
            action: "Receive purchase and update stock",
          }
        );
        return;
      }

      sendResponse(
        res,
        200,
        "Purchase status updated successfully",
        result[0],
        {
          action: "Update purchase status",
        }
      );
    } catch (error: any) {
      if (error.message.includes("already been received")) {
        sendResponse(res, 400, error.message);
        return;
      }

      if (error.message.includes("not found")) {
        sendResponse(res, 404, "Purchase not found");
        return;
      }

      throw error; // Re-throw for the outer catch
    }
  } catch (error) {
    console.error("Error updating purchase status:", error);
    sendResponse(res, 500, "Failed to update purchase status", error);
  }
};
