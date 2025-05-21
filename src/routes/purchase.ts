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
} from "../controllers/purchaseController";

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

// Update purchase status
router.post(
  "/update-status",
  validateDto(UpdatePurchaseStatusDto),
  updatePurchaseStatus
);

export default router;
