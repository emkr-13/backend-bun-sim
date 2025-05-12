import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger from "../utils/logger";
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repositories/product.repository";

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      sku,
      stock,
      categoryId,
      price_sell,
      price_cost,
    } = req.body;
    await productService.createProduct({
      name,
      description,
      sku,
      stock: parseInt(stock, 10),
      categoryId: parseInt(categoryId, 10),
      price_sell,
      price_cost,
    });
    sendResponse(res, 201, "Product created successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("already exists")
      ? 409
      : 500;
    logger.error("Error creating product:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      id,
      name,
      description,
      sku,
      stock,
      categoryId,
      price_sell,
      price_cost,
    } = req.body;
    await productService.updateProduct(id, {
      name,
      description,
      sku,
      stock: stock ? parseInt(stock, 10) : undefined,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      price_sell,
      price_cost,
    });
    sendResponse(res, 200, "Product updated successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : error.message.includes("already exists")
      ? 409
      : 500;
    logger.error("Error updating product:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;
    await productService.deleteProduct(id);
    sendResponse(res, 200, "Product deleted successfully");
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logger.error("Error deleting product:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const getProductDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;
    const product = await productService.getProductDetail(id);
    sendResponse(res, 200, "Product details retrieved successfully", product);
  } catch (error: any) {
    const statusCode = error.message.includes("required")
      ? 400
      : error.message.includes("not found")
      ? 404
      : 500;
    logger.error("Error getting product detail:", error);
    sendResponse(res, statusCode, error.message);
  }
};

export const listProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const categoryId = req.query.categoryId
      ? parseInt(req.query.categoryId as string, 10)
      : undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string)?.toLowerCase() === "asc" ? "asc" : "desc";

    const result = await productService.listProducts({
      page,
      limit,
      search,
      categoryId,
      sortBy,
      sortOrder,
    });

    sendResponse(res, 200, "Products retrieved successfully", result);
  } catch (error: any) {
    logger.error("Error listing products:", error);
    sendResponse(res, 500, error.message);
  }
};
