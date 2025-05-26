import { Router } from "express";
import {
  listStockMovements,
  getStockMovementDetail,
} from "../controllers/stockMovement.controller";
import { validateDto } from "../middleware/validationMiddleware";
import { StockMovementDetailDto } from "../dtos/stockMovement.dto";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: StockMovements
 *   description: Stock movement management endpoints
 */


router.get("/all", listStockMovements);

router.post(
  "/detail",
  validateDto(StockMovementDetailDto),
  getStockMovementDetail
);

export default router;
