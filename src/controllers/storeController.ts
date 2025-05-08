import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger from "../utils/logger";
import { StoreService } from "../services/storeService";
import { StoreRepository } from "../repositories/storeRepository";

const storeRepository = new StoreRepository();
const storeService = new StoreService(storeRepository);

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

    await storeService.createStore({
      name,
      description,
      location,
      manager,
      contactInfo,
      phone,
      email,
      address,
    });

    sendResponse(res, 201, "Store created successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("already exists")
      ? 409
      : 500;
    logger.error("Error creating store:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const updateStore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.body.id, 10);
    if (isNaN(id)) {
      throw new Error("Invalid ID format");
    }

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

    await storeService.updateStore(id, {
      name,
      description,
      location,
      manager,
      contactInfo,
      phone,
      email,
      address,
    });

    sendResponse(res, 200, "Store updated successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : error.message.includes("already exists")
      ? 409
      : 500;
    logger.error("Error updating store:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const deleteStore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.body.id, 10);
    if (isNaN(id)) {
      throw new Error("Invalid ID format");
    }

    await storeService.deleteStore(id);
    sendResponse(res, 200, "Store deleted successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logger.error("Error deleting store:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const detailStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.body.id, 10);
    if (isNaN(id)) {
      throw new Error("Invalid ID format");
    }

    const store = await storeService.getStoreDetail(id);
    sendResponse(res, 200, "Store detail retrieved successfully", store);
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logger.error("Error retrieving store detail:", error);
    sendResponse(res, statusCode, error.message);
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
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string)?.toLowerCase() === "asc" ? "asc" : "desc";

    const result = await storeService.listStores({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    sendResponse(res, 200, "Store list retrieved successfully", result);
  } catch (error: any) {
    logger.error("Error retrieving store list:", error);
    sendResponse(res, 500, error.message);
  }
};
