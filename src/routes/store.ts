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
 *     responses:
 *       200:
 *         description: List of stores retrieved successfully
 *       500:
 *         description: Server error
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStoreDto'
 *     responses:
 *       201:
 *         description: Store created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post("/create", validateDto(CreateStoreDto), createStore);

/**
 * @swagger
 * /api/store/update:
 *   post:
 *     summary: Update an existing store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStoreDto'
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Store not found
 *       500:
 *         description: Server error
 */
router.post("/update", validateDto(UpdateStoreDto), updateStore);

/**
 * @swagger
 * /api/store/delete:
 *   post:
 *     summary: Delete a store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteStoreDto'
 *     responses:
 *       200:
 *         description: Store deleted successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Store not found
 *       500:
 *         description: Server error
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreDetailDto'
 *     responses:
 *       200:
 *         description: Store details retrieved successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Store not found
 *       500:
 *         description: Server error
 */
router.post("/detail", validateDto(StoreDetailDto), detailStores);

export default router;
