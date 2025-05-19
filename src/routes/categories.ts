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
router.get("/all", listCategories);

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
  validateDto(CategoryDetailDto),
  detailCategory
);

export default router;
