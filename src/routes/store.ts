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

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Store management endpoints
 */
const router = Router();

/**
 * @swagger
 * /api/store/all:
 *   get:
 *     summary: Get list of stores
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 */
router.get("/all", listStores);

/**
 * @swagger
 * /api/store/create:
 *   post:
 *     summary: Create a new store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 */
router.post("/create",  validateDto(CreateStoreDto), createStore);

/**
 * @swagger
 * /api/store/update:
 *   post:
 *     summary: Update an existing store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 */
router.post("/update",  validateDto(UpdateStoreDto), updateStore);

/**
 * @swagger
 * /api/store/delete:
 *   post:
 *     summary: Delete a store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 */
router.post("/delete", validateDto(DeleteStoreDto), deleteStore);

/**
 * @swagger
 * /api/store/detail:
 *   post:
 *     summary: Get store details
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 */
router.post("/detail",  validateDto(StoreDetailDto), detailStores);

export default router;
