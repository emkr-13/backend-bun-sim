import { Router } from "express";
import { validateDto } from "../middleware/validationMiddleware";
import {
  CreateQuotationDto,
  QuotationDetailDto,
  UpdateQuotationStatusDto,
} from "../dtos/quotation.dto";
import {
  createQuotation,
  getAllQuotations,
  getQuotationDetail,
  updateQuotationStatus,
  exportQuotationToPdf,
} from "../controllers/quotation.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Quotation
 *   description: Quotation management endpoints
 */

// Create a new quotation
router.post("/create", validateDto(CreateQuotationDto), createQuotation);

// Get all quotations
router.get("/all", getAllQuotations);

// Get quotation by ID
router.post("/detail", validateDto(QuotationDetailDto), getQuotationDetail);

// Export quotation to PDF
router.post(
  "/export-pdf",
  validateDto(QuotationDetailDto),
  exportQuotationToPdf
);

// Update quotation status
router.post(
  "/update-status",
  validateDto(UpdateQuotationStatusDto),
  updateQuotationStatus
);

export default router;
