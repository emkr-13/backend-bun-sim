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
 *                   $ref: '#/components/schemas/PurchaseResponseDto'
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
 *     summary: Get all purchases with pagination
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
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PurchaseResponseDto'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total_data:
 *                           type: number
 *                         total_page:
 *                           type: number
 *                         total_display:
 *                           type: number
 *                         first_page:
 *                           type: boolean
 *                         last_page:
 *                           type: boolean
 *                         prev:
 *                           type: number
 *                         current:
 *                           type: number
 *                         next:
 *                           type: number
 *                         detail:
 *                           type: array
 *                           items:
 *                             type: number
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
 *                   $ref: '#/components/schemas/PurchaseDetailResponseDto'
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
 *                   oneOf:
 *                     - $ref: '#/components/schemas/PurchaseResponseDto'
 *                     - type: object
 *                       properties:
 *                         purchase:
 *                           $ref: '#/components/schemas/PurchaseResponseDto'
 *                         details:
 *                           type: array
 *                           items:
 *                             type: object
 *                         message:
 *                           type: string
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

/**
 * @swagger
 * /api/purchases/export-pdf:
 *   post:
 *     summary: Export purchase to PDF
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
 *         description: Purchase PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *             description: PDF file containing the purchase details
 *       404:
 *         description: Purchase not found
 *       500:
 *         description: Server error
 */
export const exportPurchaseToPdf = async (
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

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=purchase-${purchase.invoiceNumber}.pdf`
    );

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add company header
    doc.fontSize(20).text("PURCHASE ORDER", { align: "center" });
    doc.moveDown();

    // Add purchase details
    doc.fontSize(12).text(`Invoice Number: ${purchase.invoiceNumber}`);
    doc.text(`Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}`);
    doc.text(`Status: ${purchase.status.toUpperCase()}`);
    if (purchase.paymentDueDate) {
      doc.text(
        `Payment Due: ${new Date(purchase.paymentDueDate).toLocaleDateString()}`
      );
    }
    if (purchase.paymentTerm) {
      doc.text(`Payment Term: ${purchase.paymentTerm}`);
    }
    doc.moveDown();

    // Add supplier and store info
    doc.text(`Supplier: ${purchase.supplierName}`);
    doc.text(`Store: ${purchase.storeName}`);
    if (purchase.notes) {
      doc.text(`Notes: ${purchase.notes}`);
    }
    doc.moveDown();

    // Create table for items
    doc.fontSize(10);
    let tableTop = doc.y + 10;
    let tableLeft = 50;

    // Table headers
    doc.font("Helvetica-Bold");
    doc.text("No", tableLeft, tableTop);
    doc.text("Product", tableLeft + 30, tableTop);
    doc.text("Qty", tableLeft + 180, tableTop);
    doc.text("Unit", tableLeft + 220, tableTop);
    doc.text("Price", tableLeft + 260, tableTop);
    doc.text("Discount", tableLeft + 320, tableTop);
    doc.text("Subtotal", tableLeft + 390, tableTop);

    // Draw header line
    doc
      .moveTo(tableLeft, tableTop + 15)
      .lineTo(tableLeft + 460, tableTop + 15)
      .stroke();

    // Table content
    doc.font("Helvetica");
    let rowTop = tableTop + 25;

    purchase.details.forEach((item: any, index: number) => {
      // Ensure we don't go off the page
      if (rowTop > 700) {
        doc.addPage();
        rowTop = 50;

        // Redraw headers on new page
        tableTop = 50;
        doc.font("Helvetica-Bold");
        doc.text("No", tableLeft, tableTop);
        doc.text("Product", tableLeft + 30, tableTop);
        doc.text("Qty", tableLeft + 180, tableTop);
        doc.text("Unit", tableLeft + 220, tableTop);
        doc.text("Price", tableLeft + 260, tableTop);
        doc.text("Discount", tableLeft + 320, tableTop);
        doc.text("Subtotal", tableLeft + 390, tableTop);

        // Draw header line
        doc
          .moveTo(tableLeft, tableTop + 15)
          .lineTo(tableLeft + 460, tableTop + 15)
          .stroke();

        rowTop = tableTop + 25;
        doc.font("Helvetica");
      }

      // Draw row
      doc.text((index + 1).toString(), tableLeft, rowTop);
      doc.text(item.productName, tableLeft + 30, rowTop);
      doc.text(item.quantity.toString(), tableLeft + 180, rowTop);
      doc.text(item.satuan || "-", tableLeft + 220, rowTop);
      doc.text(
        `${Number(item.unitPrice).toLocaleString()}`,
        tableLeft + 260,
        rowTop
      );
      doc.text(`${item.discount || 0}%`, tableLeft + 320, rowTop);
      doc.text(
        `${Number(item.subtotal).toLocaleString()}`,
        tableLeft + 390,
        rowTop
      );

      rowTop += 20;
    });

    // Draw table bottom line
    doc
      .moveTo(tableLeft, rowTop)
      .lineTo(tableLeft + 460, rowTop)
      .stroke();

    // Add summary
    rowTop += 20;
    doc.font("Helvetica-Bold");
    doc.text("Total Amount:", tableLeft + 300, rowTop);
    doc.text(
      `${Number(purchase.totalAmount).toLocaleString()}`,
      tableLeft + 390,
      rowTop
    );

    rowTop += 20;
    doc.text("Discount:", tableLeft + 300, rowTop);
    doc.text(
      `${Number(purchase.discountAmount).toLocaleString()}`,
      tableLeft + 390,
      rowTop
    );

    rowTop += 20;
    doc.text("Grand Total:", tableLeft + 300, rowTop);
    doc.text(
      `${Number(purchase.grandTotal).toLocaleString()}`,
      tableLeft + 390,
      rowTop
    );

    // Add footer
    doc
      .fontSize(10)
      .text(
        "This is a computer-generated document. No signature is required.",
        50,
        doc.page.height - 50,
        { align: "center" }
      );

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error("Error exporting purchase to PDF:", error);
    sendResponse(res, 500, "Failed to export purchase to PDF", error);
  }
};
