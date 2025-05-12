import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger from "../utils/logger";
import { CategoryService } from "../services/category.service";
import { CategoryRepository } from "../repositories/category.repository";

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;
    await categoryService.createCategory(name, description);
    sendResponse(res, 201, "Category created successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("already exists")
      ? 409
      : 500;
    logger.error("Error creating category:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name, description } = req.body;
    await categoryService.updateCategory(id, name, description);
    sendResponse(res, 200, "Category updated successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logger.error("Error updating category:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;
    await categoryService.deleteCategory(id);
    sendResponse(res, 200, "Category deleted successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logger.error("Error deleting category:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const detailCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;
    const category = await categoryService.getCategoryDetail(id);
    sendResponse(res, 200, "Category details retrieved successfully", category);
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logger.error("Error retrieving category details:", error);
    sendResponse(res, statusCode, error.message);
  }
};

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
    logger.error("Error retrieving categories:", error);
    sendResponse(res, 500, error.message);
  }
};
