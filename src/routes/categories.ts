import { Router } from "express";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  detailCategory,
} from "../controllers/categories.controller";
import { validateDto } from "../middleware/validationMiddleware";
import {
  CategoryDetailDto,
  CreateCategoryDto,
  DeleteCategoryDto,
  UpdateCategoryDto,
} from "../dtos/category.dto";

const router = Router();

/**
 * @swagger
 * /api/categories/all:
 *   get:
 *     summary: Get list of categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/all", listCategories);

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
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post("/create", validateDto(CreateCategoryDto), createCategory);

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
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.post("/update", validateDto(UpdateCategoryDto), updateCategory);

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
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.post("/delete", validateDto(DeleteCategoryDto), deleteCategory);

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
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.post("/detail", validateDto(CategoryDetailDto), detailCategory);

export default router;
