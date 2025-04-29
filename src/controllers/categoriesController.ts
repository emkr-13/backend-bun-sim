import { db } from "../config/db";
import { eq, sql, ilike, and, isNull, desc, asc } from "drizzle-orm";
import { sendResponse } from "../utils/responseHelper";
import { Request, Response } from "express";
import { pagination } from "../utils/helper";
import logger from "../utils/logger";
import { categories } from "../models/categories";

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    // Validasi input
    if (!name) {
      sendResponse(res, 400, "name is required");
      logger.error("Validation error: name is required");
      return;
    }

    // Cek apakah kategori sudah ada
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name));

    if (existingCategory.length > 0) {
      sendResponse(res, 409, "Category already exists");
      logger.error("Category already exists");
      return;
    }

    // Insert kategori baru ke database
    const newCategory = await db.insert(categories).values({
      name,
      description,
    });

    sendResponse(res, 201, "Category created successfully");
    logger.info("Category created successfully");
  } catch (error) {
    logger.error("Error creating category:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name, description } = req.body;
    // Validasi input
    if (!id) {
      sendResponse(res, 400, "id is required");
      logger.error("Validation error: id is required");
      return;
    }
    // cek apakah kategori sudah ada
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    if (existingCategory.length === 0) {
      sendResponse(res, 404, "Category not found");
      logger.error("Category not found");
      return;
    }
    // Update kategori di database
    const updatedCategory = await db
      .update(categories)
      .set({
        name,
        description,
      })
      .where(eq(categories.id, id));
    sendResponse(res, 200, "Category updated successfully");
    logger.info("Category updated successfully");
  } catch (error) {
    logger.error("Error updating category:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;

    // Validasi input
    if (!id) {
      sendResponse(res, 400, "id is required");
      logger.error("Validation error: id is required");
      return;
    }

    // Cek apakah kategori ada
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));

    if (existingCategory.length === 0) {
      sendResponse(res, 404, "Category not found");
      logger.error("Category not found");
      return;
    }

    // Hapus soft delete kategori
    const deletedCategory = await db
      .update(categories)
      .set({ deletedAt: new Date() })
      .where(eq(categories.id, id));

    sendResponse(res, 200, "Category deleted successfully");
    logger.info("Category deleted successfully");
  } catch (error) {
    logger.error("Error deleting category:", error);
    sendResponse(res, 500, "Internal server error");
  }
};

export const detailCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;
    // Validasi input
    if (!id) {
      sendResponse(res, 400, "id is required");
      logger.error("Validation error: id is required");
      return;
    }
    // Cek apakah kategori ada
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    if (existingCategory.length === 0) {
      sendResponse(res, 404, "Category not found");
      logger.error("Category not found");
      return;
    }
    // Ambil detail kategori
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    sendResponse(res, 200, "Category details retrieved successfully", category);
    logger.info("Category details retrieved successfully");
  } catch (error) {
    logger.error("Error retrieving category details:", error);
    sendResponse(res, 500, "Internal server error");
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
    const sortBy = (req.query.sortBy as string) || "createdAt"; // Default sort by createdAt
    const sortOrder =
      (req.query.sortOrder as string)?.toLowerCase() === "desc" ? asc : desc; // Default desc

    let query = db
      .select()
      .from(categories)
      .where(
        search
          ? and(
              isNull(categories.deletedAt),
              ilike(categories.name, `%${search}%`)
            )
          : isNull(categories.deletedAt)
      )
      .orderBy(
        sortBy === "name"
          ? sortOrder(categories.name)
          : sortOrder(categories.createdAt)
      );

    // Count the total number of records in the database
    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .where(
        search
          ? and(
              isNull(categories.deletedAt),
              ilike(categories.name, `%${search}%`)
            )
          : isNull(categories.deletedAt)
      );

    // Call the pagination helper function
    const paginationResult = await pagination(total.count, page, limit);

    // Fetch the data for the current page
    const data = await query.limit(limit).offset((page - 1) * limit);

    sendResponse(res, 200, "Categories retrieved successfully", {
      data,
      pagination: paginationResult,
    });
    logger.info("Categories retrieved successfully");
  } catch (error) {
    logger.error("Error retrieving categories:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
