import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import logger from "../utils/logger";
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repositories/product.repository";
import {
  CreateProductDto,
  DeleteProductDto,
  ProductDetailDto,
  UpdateProductDto,
} from "../dtos/product.dto";
import { BaseDto } from "../dtos/base.dto";

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
    const { name, description, price, categoryId } =
      req.body as CreateProductDto;

    await productService.createProduct({
      name,
      description,
      categoryId: parseInt(categoryId, 10), // Convert UUID to number if needed
      // Add any other required fields with default values if needed
      sku: `SKU-${Date.now()}`,
      stock: 0,
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
    logger.error("Error creating product:", error);
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
    const { id, name, description, categoryId, price } =
      req.body as UpdateProductDto;

    await productService.updateProduct(parseInt(id, 10), {
      name,
      description,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
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
    logger.error("Error updating product:", error);
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
    await productService.deleteProduct(parseInt(id, 10));
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
    const product = await productService.getProductDetail(parseInt(id, 10));
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
 *           type: string
 *           format: uuid
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
