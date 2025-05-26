import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger, { logApiError } from "../utils/logger";
import { CategoryService } from "../services/category.service";
import { CategoryRepository } from "../repositories/category.repository";
import {
  CategoryDetailDto,
  CreateCategoryDto,
  DeleteCategoryDto,
  UpdateCategoryDto,
} from "../dtos/category.dto";

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);

/**
 * @swagger
 * /api/categories/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryDto'
 *     responses:
 *       201:
 *         description: Category created successfully
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
 *                   type: null
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Server error
 */
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body as CreateCategoryDto;
    await categoryService.createCategory(name, description);
    sendResponse(res, 201, "Category created successfully");
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
 * /api/categories/update:
 *   post:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryDto'
 *     responses:
 *       200:
 *         description: Category updated successfully
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
 *                   type: null
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name, description } = req.body as UpdateCategoryDto;
    await categoryService.updateCategory(id, name, description);
    sendResponse(res, 200, "Category updated successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
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
 * /api/categories/delete:
 *   post:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteCategoryDto'
 *     responses:
 *       200:
 *         description: Category deleted successfully
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
 *                   type: null
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body as DeleteCategoryDto;
    await categoryService.deleteCategory(id);
    sendResponse(res, 200, "Category deleted successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
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
 * /api/categories/detail:
 *   post:
 *     summary: Get category details
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryDetailDto'
 *     responses:
 *       200:
 *         description: Category details retrieved successfully
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
 *                   $ref: '#/components/schemas/CategoryResponseDto'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
export const detailCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body as CategoryDetailDto;
    const category = await categoryService.getCategoryDetail(id);
    sendResponse(res, 200, "Category details retrieved successfully", category);
  } catch (error: any) {
    const statusCode = error.message.includes("required")
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
 * /api/categories/all:
 *   get:
 *     summary: Get list of categories
 *     tags: [Categories]
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
 *         description: Categories retrieved successfully
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
 *                         $ref: '#/components/schemas/CategoryResponseDto'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total_data:
 *                           type: number
 *                         total_page:
 *                           type: number
 *                         total_display:
 *                           type: number
 *                         first_page:
 *                           type: boolean
 *                         last_page:
 *                           type: boolean
 *                         prev:
 *                           type: number
 *                         current:
 *                           type: number
 *                         next:
 *                           type: number
 *                         detail:
 *                           type: array
 *                           items:
 *                             type: number
 *       500:
 *         description: Server error
 */
export const listCategories = async (
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

    const result = await categoryService.listCategories({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    sendResponse(res, 200, "Categories retrieved successfully", result);
  } catch (error: any) {
    logApiError(500, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, 500, error.message);
  }
};
