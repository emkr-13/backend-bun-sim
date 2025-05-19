import { Router } from "express";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
} from "../controllers/product.controller";
import { validateDto } from "../middleware/validationMiddleware";
import {
  CreateProductDto,
  DeleteProductDto,
  ProductDetailDto,
  UpdateProductDto,
} from "../dtos/product.dto";

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */
const router = Router();

/**
 * @swagger
 * /api/products/all:
 *   get:
 *     summary: Get list of products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.get("/all", listProducts);

/**
 * @swagger
 * /api/products/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post("/create", validateDto(CreateProductDto), createProduct);

/**
 * @swagger
 * /api/products/update:
 *   post:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post("/update", validateDto(UpdateProductDto), updateProduct);

/**
 * @swagger
 * /api/products/delete:
 *   post:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post("/delete", validateDto(DeleteProductDto), deleteProduct);

/**
 * @swagger
 * /api/products/detail:
 *   post:
 *     summary: Get product details
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post("/detail", validateDto(ProductDetailDto), getProductDetail);

export default router;
