import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger from "../utils/logger";
import { AkunService } from "../services/akun.service";
import { AkunRepository } from "../repositories/akun.repository";
import { plainToInstance } from "class-transformer";
import {
  CreateAkunDto,
  UpdateAkunDto,
  DeleteAkunDto,
  AkunDetailDto,
} from "../dtos/akun.dto";

const akunRepository = new AkunRepository();
const akunService = new AkunService(akunRepository);

/**
 * @swagger
 * /api/akun/create:
 *   post:
 *     summary: Create a new account
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAkunDto'
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Account already exists
 *       500:
 *         description: Server error
 */
export const createAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const akunData = plainToInstance(CreateAkunDto, req.body);
    await akunService.createAkun(akunData);
    sendResponse(res, 201, "Akun created successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("already exists")
      ? 409
      : error.message.includes("Invalid")
      ? 400
      : 500;
    logger.error("Error creating akun:", error);
    sendResponse(res, statusCode, error.message);
  }
};

/**
 * @swagger
 * /api/akun/update:
 *   post:
 *     summary: Update an existing account
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAkunDto'
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
export const updateAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updateData = plainToInstance(UpdateAkunDto, req.body);
    const { id, ...akunData } = updateData;
    await akunService.updateAkun(id, akunData);
    sendResponse(res, 200, "Akun updated successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : error.message.includes("Invalid")
      ? 400
      : 500;
    logger.error("Error updating akun:", error);
    sendResponse(res, statusCode, error.message);
  }
};

/**
 * @swagger
 * /api/akun/delete:
 *   post:
 *     summary: Delete an account
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteAkunDto'
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
export const deleteAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = plainToInstance(DeleteAkunDto, req.body);
    await akunService.deleteAkun(id);
    sendResponse(res, 200, "Akun deleted successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logger.error("Error deleting akun:", error);
    sendResponse(res, statusCode, error.message);
  }
};

/**
 * @swagger
 * /api/akun/detail:
 *   post:
 *     summary: Get account details
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AkunDetailDto'
 *     responses:
 *       200:
 *         description: Account found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AkunResponseDto'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
export const detailAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = plainToInstance(AkunDetailDto, req.body);
    const akun = await akunService.getAkunDetail(id);
    sendResponse(res, 200, "Akun found", akun);
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logger.error("Error getting akun detail:", error);
    sendResponse(res, statusCode, error.message);
  }
};

/**
 * @swagger
 * /api/akun/all:
 *   get:
 *     summary: Get list of accounts
 *     tags: [Akun]
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
 *         description: Search term for account name or email
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [customer, supplier]
 *         description: Filter by account type
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
 *         description: List of accounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AkunResponseDto'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Server error
 */
export const listAkuns = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const type = req.query.type as "customer" | "supplier" | undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string)?.toLowerCase() === "asc" ? "asc" : "desc";

    const result = await akunService.listAkuns({
      page,
      limit,
      search,
      type,
      sortBy,
      sortOrder,
    });

    sendResponse(res, 200, "Akuns retrieved successfully", result);
  } catch (error: any) {
    logger.error("Error retrieving akuns:", error);
    sendResponse(res, 500, error.message);
  }
};
