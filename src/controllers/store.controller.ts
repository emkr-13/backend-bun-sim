import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger, { logApiError } from "../utils/logger";
import { StoreService } from "../services/store.service";
import { StoreRepository } from "../repositories/store.repository";
import {
  CreateStoreDto,
  DeleteStoreDto,
  StoreDetailDto,
  UpdateStoreDto,
} from "../dtos/store.dto";

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
    } = req.body as CreateStoreDto;

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
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
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
    } = req.body as UpdateStoreDto;

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
    const statusCode =
      error.message.includes("required") || error.message.includes("Invalid ID")
        ? 400
        : error.message.includes("not found")
        ? 404
        : error.message.includes("already exists")
        ? 409
        : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

export const deleteStore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body as DeleteStoreDto;
    await storeService.deleteStore(id);
    sendResponse(res, 200, "Store deleted successfully");
  } catch (error: any) {
    const statusCode =
      error.message.includes("required") || error.message.includes("Invalid ID")
        ? 400
        : error.message.includes("not found")
        ? 404
        : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

export const detailStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body as StoreDetailDto;
    const store = await storeService.getStoreDetail(id);
    sendResponse(res, 200, "Store detail retrieved successfully", store);
  } catch (error: any) {
    const statusCode =
      error.message.includes("required") || error.message.includes("Invalid ID")
        ? 400
        : error.message.includes("not found")
        ? 404
        : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
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
    logApiError(500, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, 500, error.message);
  }
};
