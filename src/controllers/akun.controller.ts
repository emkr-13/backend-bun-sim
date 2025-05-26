import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger, { logApiError } from "../utils/logger";
import { AkunService } from "../services/akun.service";
import { AkunRepository } from "../repositories/akun.repository";
import { plainToInstance } from "class-transformer";
import {
  CreateAkunDto,
  UpdateAkunDto,
  DeleteAkunDto,
  AkunDetailDto,
} from "../dtos/akun.dto";

const akunRepository = new AkunRepository();
const akunService = new AkunService(akunRepository);

export const createAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const akunData = plainToInstance(CreateAkunDto, req.body);
    await akunService.createAkun(akunData);
    sendResponse(res, 201, "Akun created successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("already exists")
      ? 409
      : error.message.includes("Invalid")
      ? 400
      : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

export const updateAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updateData = plainToInstance(UpdateAkunDto, req.body);
    const { id, ...akunData } = updateData;
    await akunService.updateAkun(id, akunData);
    sendResponse(res, 200, "Akun updated successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : error.message.includes("Invalid")
      ? 400
      : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

export const deleteAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = plainToInstance(DeleteAkunDto, req.body);
    await akunService.deleteAkun(id);
    sendResponse(res, 200, "Akun deleted successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

export const detailAkun = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = plainToInstance(AkunDetailDto, req.body);
    const akun = await akunService.getAkunDetail(id);
    sendResponse(res, 200, "Akun found", akun);
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
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
    logApiError(500, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, 500, error.message);
  }
};
