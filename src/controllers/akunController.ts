import { db } from "../config/db";
import { eq, sql, ilike, and, isNull, desc, asc } from "drizzle-orm";
import { sendResponse } from "../utils/responseHelper";
import e, { Request, Response } from "express";
import { pagination } from "../utils/helper";
import logger from "../utils/logger";
import { akuns } from "../models/akun";

export const createAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, contactInfo, phone, email, address, type } = req.body;

    // Validasi input
    if (!name) {
      sendResponse(res, 400, "name is required");
      logger.error("Validation error: name is required");
      return;
    }
    // cek email
    const existingAkun = await db
      .select()
      .from(akuns)
      .where(eq(akuns.email, email));

    if (existingAkun.length > 0) {
      sendResponse(res, 409, "Akun already exists");
      logger.error("Akun already exists");
      return;
    }
    // regex email and check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      sendResponse(res, 400, "Invalid email format");
      logger.error("Invalid email format");
      return;
    }
    // check type sudah dengan enum
    const validTypes = ["customer", "supplier"];
    if (!validTypes.includes(type)) {
      sendResponse(res, 400, "Invalid type");
      logger.error("Invalid type");
      return;
    }
    // Insert akun baru ke database
    const newAkun = await db.insert(akuns).values({
      name,
      contactInfo,
      phone,
      email,
      address,
      type,
    });
    sendResponse(res, 201, "Akun created successfully");
    logger.info("Akun created successfully");
  } catch (error) {
    logger.error("Error creating akun:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const updateAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name, contactInfo, phone, email, address, type } = req.body;

    // Validasi input
    if (!id) {
      sendResponse(res, 400, "id is required");
      logger.error("Validation error: id is required");
      return;
    }
    // cek apakah akun sudah ada
    const existingAkun = await db.select().from(akuns).where(eq(akuns.id, id));
    if (existingAkun.length === 0) {
      sendResponse(res, 404, "Akun not found");
      logger.error("Akun not found");
      return;
    }
    // regex email and check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      sendResponse(res, 400, "Invalid email format");
      logger.error("Invalid email format");
      return;
    }
    // check type sudah dengan enum
    const validTypes = ["customer", "supplier"];
    if (!validTypes.includes(type)) {
      sendResponse(res, 400, "Invalid type");
      logger.error("Invalid type");
      return;
    }
    // Update akun ke database
    const updatedAkun = await db
      .update(akuns)
      .set({
        name,
        contactInfo,
        phone,
        email,
        address,
        type,
        updatedAt: new Date(),
      })
      .where(eq(akuns.id, id));
    sendResponse(res, 200, "Akun updated successfully");
    logger.info("Akun updated successfully");
  } catch (error) {
    logger.error("Error updating akun:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const deleteAkun = async (
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

    // Cek apakah akun ada
    const existingAkun = await db.select().from(akuns).where(eq(akuns.id, id));

    if (existingAkun.length === 0) {
      sendResponse(res, 404, "Akun not found");
      logger.error("Akun not found");
      return;
    }
    // soft delete akun
    const deletedAkun = await db
      .update(akuns)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(akuns.id, id));
    sendResponse(res, 200, "Akun deleted successfully");
    logger.info("Akun deleted successfully");
  } catch (error) {
    logger.error("Error deleting akun:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const detailAkun = async (
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
    // Cek apakah akun ada
    const existingAkun = await db.select().from(akuns).where(eq(akuns.id, id));

    if (existingAkun.length === 0) {
      sendResponse(res, 404, "Akun not found");
      logger.error("Akun not found");
      return;
    }
    // get detail akun
    const detailAkun = await db.select().from(akuns).where(eq(akuns.id, id));
    sendResponse(res, 200, "Akun found", detailAkun);
    logger.info("Akun found");
  } catch (error) {
    logger.error("Error getting akun detail:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
export const listAkuns = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const type = req.query.type as "customer" | "supplier" | undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string)?.toLowerCase() === "desc" ? asc : desc;

    // Validate type if provided
    if (type && !["customer", "supplier"].includes(type)) {
      sendResponse(res, 400, "Invalid type filter");
      logger.error("Invalid type filter");
      return;
    }

    // Build where conditions
    let whereConditions = and(isNull(akuns.deletedAt));
    if (search) {
      whereConditions = and(whereConditions, ilike(akuns.name, `%${search}%`));
    }
    if (type) {
      whereConditions = and(whereConditions, eq(akuns.type, type));
    }

    let query = db
      .select()
      .from(akuns)
      .where(whereConditions)
      .orderBy(
        sortBy === "name" ? sortOrder(akuns.name) : sortOrder(akuns.createdAt)
      );

    // Count the total number of records
    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(akuns)
      .where(whereConditions);

    // Call the pagination helper function
    const paginationResult = await pagination(total.count, page, limit);

    // Fetch the data for the current page
    const data = await query.limit(limit).offset((page - 1) * limit);

    sendResponse(res, 200, "Akuns retrieved successfully", {
      data,
      pagination: paginationResult,
    });
  } catch (error) {
    logger.error("Error getting list akuns:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
