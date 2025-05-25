import { Router } from "express";
import {
  createStore,
  listStores,
  updateStore,
  deleteStore,
  detailStores,
} from "../controllers/store.controller";
import { validateDto } from "../middleware/validationMiddleware";
import {
  CreateStoreDto,
  DeleteStoreDto,
  StoreDetailDto,
  UpdateStoreDto,
} from "../dtos/store.dto";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Store management endpoints
 */

// Get all stores
router.get("/all", listStores);

// Create a new store
router.post("/create", validateDto(CreateStoreDto), createStore);

// Update a store
router.post("/update", validateDto(UpdateStoreDto), updateStore);

// Delete a store
router.post("/delete", validateDto(DeleteStoreDto), deleteStore);

// Get store details
router.post("/detail", validateDto(StoreDetailDto), detailStores);

export default router;
