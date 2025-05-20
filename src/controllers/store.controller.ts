import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger, { logApiError } from "../utils/logger";
import { StoreService } from "../services/store.service";
import { StoreRepository } from "../repositories/store.repository";
import {
  CreateStoreDto,
  DeleteStoreDto,
  StoreDetailDto,
  UpdateStoreDto,
} from "../dtos/store.dto";

const storeRepository = new StoreRepository();
const storeService = new StoreService(storeRepository);

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
 *       409:
 *         description: Store already exists
 *       500:
 *         description: Server error
 */
export const createStore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      location,
      manager,
      contactInfo,
      phone,
      email,
      address,
    } = req.body as CreateStoreDto;

    await storeService.createStore({
      name,
      description,
      location,
      manager,
      contactInfo,
      phone,
      email,
      address,
    });

    sendResponse(res, 201, "Store created successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("already exists")
      ? 409
      : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

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
 *       409:
 *         description: Store with this name already exists
 *       500:
 *         description: Server error
 */
export const updateStore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      id,
      name,
      description,
      location,
      manager,
      contactInfo,
      phone,
      email,
      address,
    } = req.body as UpdateStoreDto;

    await storeService.updateStore(id, {
      name,
      description,
      location,
      manager,
      contactInfo,
      phone,
      email,
      address,
    });

    sendResponse(res, 200, "Store updated successfully");
  } catch (error: any) {
    const statusCode =
      error.message.includes("required") || error.message.includes("Invalid ID")
        ? 400
        : error.message.includes("not found")
        ? 404
        : error.message.includes("already exists")
        ? 409
        : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

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
export const deleteStore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body as DeleteStoreDto;
    await storeService.deleteStore(id);
    sendResponse(res, 200, "Store deleted successfully");
  } catch (error: any) {
    const statusCode =
      error.message.includes("required") || error.message.includes("Invalid ID")
        ? 400
        : error.message.includes("not found")
        ? 404
        : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

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
 *         description: Store detail retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/StoreResponseDto'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Store not found
 *       500:
 *         description: Server error
 */
export const detailStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body as StoreDetailDto;
    const store = await storeService.getStoreDetail(id);
    sendResponse(res, 200, "Store detail retrieved successfully", store);
  } catch (error: any) {
    const statusCode =
      error.message.includes("required") || error.message.includes("Invalid ID")
        ? 400
        : error.message.includes("not found")
        ? 404
        : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

/**
 * @swagger
 * /api/store/all:
 *   get:
 *     summary: Get list of stores
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Store list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/StoreResponseDto'
 *                     pagination:
 *                       type: object
 *       500:
 *         description: Server error
 */
export const listStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string)?.toLowerCase() === "asc" ? "asc" : "desc";

    const result = await storeService.listStores({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    sendResponse(res, 200, "Store list retrieved successfully", result);
  } catch (error: any) {
    logApiError(500, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, 500, error.message);
  }
};
