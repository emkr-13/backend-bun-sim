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
import { authenticate } from "../middleware/authMiddleware";

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */
const router = Router();

/**
 * @swagger
 * /api/categories/all:
 *   get:
 *     summary: Get list of categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 */
router.get("/all", authenticate, listCategories);

/**
 * @swagger
 * /api/categories/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/create",
  authenticate,
  validateDto(CreateCategoryDto),
  createCategory
);

/**
 * @swagger
 * /api/categories/update:
 *   post:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/update",
  authenticate,
  validateDto(UpdateCategoryDto),
  updateCategory
);

/**
 * @swagger
 * /api/categories/delete:
 *   post:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/delete",
  authenticate,
  validateDto(DeleteCategoryDto),
  deleteCategory
);

/**
 * @swagger
 * /api/categories/detail:
 *   post:
 *     summary: Get category details
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/detail",
  authenticate,
  validateDto(CategoryDetailDto),
  detailCategory
);

export default router;
