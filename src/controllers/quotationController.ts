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
 *                   $ref: '#/components/schemas/QuotationResponseDto'
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
 *     summary: Get all quotations with pagination
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
 *         description: Search by quotation number or customer name
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
 *                         $ref: '#/components/schemas/QuotationResponseDto'
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
 *                   $ref: '#/components/schemas/QuotationDetailResponseDto'
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
 *                     - $ref: '#/components/schemas/QuotationResponseDto'
 *                     - type: object
 *                       properties:
 *                         quotation:
 *                           $ref: '#/components/schemas/QuotationResponseDto'
 *                         details:
 *                           type: array
 *                           items:
 *                             type: object
 *                         message:
 *                           type: string
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

      // For accepted quotations, include additional information in the response
      if (status === "accepted") {
        const updatedQuotation = await quotationService.getQuotationById(id);

        sendResponse(
          res,
          200,
          "Quotation accepted and stock updated successfully",
          {
            quotation: result[0],
            details: updatedQuotation?.details || [],
            message:
              "Stock has been automatically reduced for all products in this quotation",
          },
          {
            action: "Accept quotation and update stock",
          }
        );
        return;
      }

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

      if (error.message.includes("Insufficient stock")) {
        sendResponse(res, 400, error.message, {
          error: "INSUFFICIENT_STOCK",
          details: error.message,
        });
        return;
      }

      throw error; // Re-throw for the outer catch
    }
  } catch (error) {
    console.error("Error updating quotation status:", error);
    sendResponse(res, 500, "Failed to update quotation status", error);
  }
};

/**
 * @swagger
 * /api/quotations/export-pdf:
 *   post:
 *     summary: Export quotation to PDF
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
 *         description: Quotation PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *             description: PDF file containing the quotation details
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
export const exportQuotationToPdf = async (
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

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=quotation-${quotation.quotationNumber}.pdf`
    );

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add company header
    doc.fontSize(20).text("QUOTATION", { align: "center" });
    doc.moveDown();

    // Add quotation details
    doc.fontSize(12).text(`Quotation Number: ${quotation.quotationNumber}`);
    doc.text(`Date: ${new Date(quotation.quotationDate).toLocaleDateString()}`);
    doc.text(`Status: ${quotation.status.toUpperCase()}`);
    doc.moveDown();

    // Add customer and store info
    doc.text(`Customer: ${quotation.customerName}`);
    doc.text(`Store: ${quotation.storeName}`);
    if (quotation.notes) {
      doc.text(`Notes: ${quotation.notes}`);
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

    quotation.details.forEach((item: any, index: number) => {
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
    doc.text("Subtotal:", tableLeft + 300, rowTop);
    doc.text(
      `${Number(quotation.subtotal).toLocaleString()}`,
      tableLeft + 390,
      rowTop
    );

    rowTop += 20;
    doc.text("Discount:", tableLeft + 300, rowTop);
    doc.text(
      `${Number(quotation.discountAmount).toLocaleString()}`,
      tableLeft + 390,
      rowTop
    );

    rowTop += 20;
    doc.text("Grand Total:", tableLeft + 300, rowTop);
    doc.text(
      `${Number(quotation.grandTotal).toLocaleString()}`,
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
    console.error("Error exporting quotation to PDF:", error);
    sendResponse(res, 500, "Failed to export quotation to PDF", error);
  }
};
