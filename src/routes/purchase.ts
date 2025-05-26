import { Router } from "express";
import { validateDto } from "../middleware/validationMiddleware";
import {
  CreatePurchaseDto,
  PurchaseDetailDto,
  UpdatePurchaseStatusDto,
} from "../dtos/purchase.dto";
import {
  createPurchase,
  getAllPurchases,
  getPurchaseDetail,
  updatePurchaseStatus,
  exportPurchaseToPdf,
} from "../controllers/purchase.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Purchase
 *   description: Purchase management endpoints
 */

// Create a new purchase
router.post("/create", validateDto(CreatePurchaseDto), createPurchase);

// Get all purchases
router.get("/all", getAllPurchases);

// Get purchase by ID
router.post("/detail", validateDto(PurchaseDetailDto), getPurchaseDetail);

// Export purchase to PDF
router.post("/export-pdf", validateDto(PurchaseDetailDto), exportPurchaseToPdf);

// Update purchase status
router.post(
  "/update-status",
  validateDto(UpdatePurchaseStatusDto),
  updatePurchaseStatus
);

export default router;
