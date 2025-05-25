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
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */

// Get all categories
router.get("/all", listCategories);

// Create a new category
router.post("/create", validateDto(CreateCategoryDto), createCategory);

// Update a category
router.post("/update", validateDto(UpdateCategoryDto), updateCategory);

// Delete a category
router.post("/delete", validateDto(DeleteCategoryDto), deleteCategory);

// Get category details
router.post("/detail", validateDto(CategoryDetailDto), detailCategory);

export default router;
