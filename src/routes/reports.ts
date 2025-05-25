import { Router } from "express";
import {
  generateQuotationsPdfReport,
  generatePurchasesPdfReport,
  generateCombinedPdfReport,
} from "../controllers/report.controller";
import { validateDto } from "../middleware/validationMiddleware";
import { ReportFilterDto } from "../dtos/report.dto";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report generation endpoints
 */

// Generate quotations PDF report
router.post(
  "/quotations/pdf",
  authenticate,
  validateDto(ReportFilterDto),
  generateQuotationsPdfReport
);

// Generate purchases PDF report
router.post(
  "/purchases/pdf",
  authenticate,
  validateDto(ReportFilterDto),
  generatePurchasesPdfReport
);

// Generate combined PDF report
router.post(
  "/combined/pdf",
  authenticate,
  validateDto(ReportFilterDto),
  generateCombinedPdfReport
);

export default router;
