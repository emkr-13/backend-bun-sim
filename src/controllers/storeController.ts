import { db } from "../config/db";
import { eq, sql, ilike, and, isNull, desc, asc } from "drizzle-orm";
import { sendResponse } from "../utils/responseHelper";
import { Request, Response } from "express";
import { pagination } from "../utils/helper";
import logger from "../utils/logger";
import { store } from "../models/store";

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
    } = req.body;

    // Validasi input
    if (!name) {
      sendResponse(res, 400, "name is required");
      logger.error("Validation error: name is required");
      return;
    }

    // Cek apakah store sudah ada
    const existingstore = await db
      .select()
      .from(store)
      .where(eq(store.name, name));

    if (existingstore.length > 0) {
      sendResponse(res, 409, "store already exists");
      logger.error("store already exists");
      return;
    }

    // Insert store baru ke database
    const newstore = await db.insert(store).values({
      name,
      description,
      location,
      manager,
      contactInfo,
      phone,
      email,
      address,
    });

    sendResponse(res, 201, "store created successfully");
    logger.info("store created successfully");
  } catch (error) {
    logger.error("Error creating store:", error);
    sendResponse(res, 500, "Internal server error");
  }
};

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
    } = req.body;
    // Validasi input
    if (!id) {
      sendResponse(res, 400, "id is required");
      logger.error("Validation error: id is required");
      return;
    }
    // cek apakah store sudah ada
    const existingstore = await db.select().from(store).where(eq(store.id, id));

    if (existingstore.length === 0) {
      sendResponse(res, 404, "store not found");
      logger.error("store not found");
      return;
    }

    // Update store di database
    await db
      .update(store)
      .set({
        name,
        description,
        location,
        manager,
        contactInfo,
        phone,
        email,
        address,
        updatedAt: new Date(),
      })
      .where(eq(store.id, id));

    sendResponse(res, 200, "store updated successfully");
    logger.info("store updated successfully");
  } catch (error) {
    logger.error("Error updating store:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const deleteStore = async (
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

    // Cek apakah store sudah ada
    const existingstore = await db.select().from(store).where(eq(store.id, id));

    if (existingstore.length === 0) {
      sendResponse(res, 404, "store not found");
      logger.error("store not found");
      return;
    }

    // Hapus store dari database
    await db.delete(store).where(eq(store.id, id));

    sendResponse(res, 200, "store deleted successfully");
    logger.info("store deleted successfully");
  } catch (error) {
    logger.error("Error deleting store:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const detailStores = async (
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

    // Cek apakah store sudah ada
    const existingstore = await db.select().from(store).where(eq(store.id, id));

    if (existingstore.length === 0) {
      sendResponse(res, 404, "store not found");
      logger.error("store not found");
      return;
    }

    // Ambil detail store dari database
    const storeDetail = await db.select().from(store).where(eq(store.id, id));

    sendResponse(res, 200, "store detail retrieved successfully", storeDetail);
    logger.info("store detail retrieved successfully");
  } catch (error) {
    logger.error("Error retrieving store detail:", error);
    sendResponse(res, 500, "Internal server error");
  }
};

export const listStores = async (
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
      .from(store)
      .where(
        search
          ? and(ilike(store.name, `%${search}%`), isNull(store.deletedAt))
          : isNull(store.deletedAt)
      )
      .orderBy(
        sortBy === "name" ? sortOrder(store.name) : sortOrder(store.createdAt)
      );
    // Count the total number of records in the database
    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(store)
      .where(
        search
          ? and(ilike(store.name, `%${search}%`), isNull(store.deletedAt))
          : isNull(store.deletedAt)
      );
    // Call the pagination helper function
    const paginationResult = await pagination(total.count, page, limit);
    // Apply pagination to the query
    const data = await query.limit(limit).offset((page - 1) * limit);
    sendResponse(res, 200, "store list retrieved successfully", {
      data,
      pagination: paginationResult,
    });
  } catch (error) {
    logger.error("Error retrieving store list:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
