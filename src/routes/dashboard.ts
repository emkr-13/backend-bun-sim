import { Router } from "express";
import {
  getSummaryGeneral,
  getSummarySpecific
} from "../controllers/dashboard.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard endpoints for summary data
 */

// Get general summary (total customers, suppliers, stores, products)
router.get("/summary-general", getSummaryGeneral);

// Get specific summary with time filters
router.get("/summary-specific", getSummarySpecific);

export default router; 