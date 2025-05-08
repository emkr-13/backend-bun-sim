import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger from "../utils/logger";
import { AkunService } from "../services/akunService";
import { AkunRepository } from "../repositories/akunRepository";

const akunRepository = new AkunRepository();
const akunService = new AkunService(akunRepository);

export const createAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, phone, email, address, type } = req.body;
    await akunService.createAkun({ name, phone, email, address, type });
    sendResponse(res, 201, "Akun created successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("already exists")
      ? 409
      : error.message.includes("Invalid")
      ? 400
      : 500;
    logger.error("Error creating akun:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const updateAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.body.id, 10);
    if (isNaN(id)) {
      throw new Error("Invalid ID format");
    }
    const { name, phone, email, address, type } = req.body;
    await akunService.updateAkun(id, { name, phone, email, address, type });
    sendResponse(res, 200, "Akun updated successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : error.message.includes("Invalid")
      ? 400
      : 500;
    logger.error("Error updating akun:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const deleteAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.body.id, 10);
    if (isNaN(id)) {
      throw new Error("Invalid ID format");
    }
    await akunService.deleteAkun(id);
    sendResponse(res, 200, "Akun deleted successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logger.error("Error deleting akun:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const detailAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.body.id, 10);
    if (isNaN(id)) {
      throw new Error("Invalid ID format");
    }
    const akun = await akunService.getAkunDetail(id);
    sendResponse(res, 200, "Akun found", akun);
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logger.error("Error getting akun detail:", error);
    sendResponse(res, statusCode, error.message);
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
      (req.query.sortOrder as string)?.toLowerCase() === "asc" ? "asc" : "desc";

    const result = await akunService.listAkuns({
      page,
      limit,
      search,
      type,
      sortBy,
      sortOrder,
    });

    sendResponse(res, 200, "Akuns retrieved successfully", result);
  } catch (error: any) {
    logger.error("Error retrieving akuns:", error);
    sendResponse(res, 500, error.message);
  }
};
