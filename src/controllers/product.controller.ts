import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger, { logApiError } from "../utils/logger";
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repositories/product.repository";
import {
  CreateProductDto,
  DeleteProductDto,
  ProductDetailDto,
  UpdateProductDto,
} from "../dtos/product.dto";
import { BaseDto } from "../dtos/base.dto";
import { exportToPdf, exportToExcel } from "../utils/exportUtils";

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

/**
 * @swagger
 * /api/products/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDto'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Product already exists
 *       500:
 *         description: Server error
 */
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, price, categoryId, satuan } =
      req.body as CreateProductDto;

    await productService.createProduct({
      name,
      description,
      categoryId,
      satuan,
      // Add any other required fields with default values if needed
      sku: `SKU-${Date.now()}`,
      price_sell: price.toString(),
      price_cost: (price * 0.7).toString(),
    });

    sendResponse(res, 201, "Product created successfully");
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

/**
 * @swagger
 * /api/products/update:
 *   post:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductDto'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name, description, categoryId, price, satuan } =
      req.body as UpdateProductDto;

    await productService.updateProduct(id, {
      name,
      description,
      categoryId,
      satuan,
      price_sell: price ? price.toString() : undefined,
      price_cost: price ? (price * 0.7).toString() : undefined,
      // Add other fields as needed
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
    logApiError(statusCode, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, statusCode, error.message);
  }
};

/**
 * @swagger
 * /api/products/delete:
 *   post:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteProductDto'
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body as DeleteProductDto;
    await productService.deleteProduct(id);
    sendResponse(res, 200, "Product deleted successfully");
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

/**
 * @swagger
 * /api/products/detail:
 *   post:
 *     summary: Get product details
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductDetailDto'
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
export const getProductDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body as ProductDetailDto;
    const product = await productService.getProductDetail(id);
    sendResponse(res, 200, "Product details retrieved successfully", product);
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

/**
 * @swagger
 * /api/products/all:
 *   get:
 *     summary: Get list of products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       500:
 *         description: Server error
 */
export const listProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const categoryId = req.query.categoryId
      ? parseInt(req.query.categoryId as string)
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
    logApiError(500, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, 500, error.message);
  }
};

/**
 * @swagger
 * /api/products/export/pdf:
 *   get:
 *     summary: Export products list to PDF
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Custom title for the report
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Server error
 */
export const exportProductsToPdf = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const title = (req.query.title as string) || "Products Report";
    const products = await productService.getProductsForExport();

    // Stream PDF to client
    exportToPdf(res, products, title);

    // No need for sendResponse as exportToPdf handles the response
    logger.info("Products exported to PDF successfully");
  } catch (error: any) {
    logApiError(500, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, 500, "Failed to export products to PDF");
  }
};

/**
 * @swagger
 * /api/products/export/excel:
 *   get:
 *     summary: Export products list to Excel
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Custom title for the report
 *     responses:
 *       200:
 *         description: Excel file
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Server error
 */
export const exportProductsToExcel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const title = (req.query.title as string) || "Products Report";
    const products = await productService.getProductsForExport();

    // Stream Excel to client
    await exportToExcel(res, products, title);

    // No need for sendResponse as exportToExcel handles the response
    logger.info("Products exported to Excel successfully");
  } catch (error: any) {
    logApiError(500, error.message, `${req.baseUrl}${req.path}`, error);
    sendResponse(res, 500, "Failed to export products to Excel");
  }
};
