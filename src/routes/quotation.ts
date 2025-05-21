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
} from "../controllers/quotationController";

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

// Update quotation status
router.post(
  "/update-status",
  validateDto(UpdateQuotationStatusDto),
  updateQuotationStatus
);

export default router;
