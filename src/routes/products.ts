import { Router } from "express";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  exportProductsToPdf,
  exportProductsToExcel,
} from "../controllers/product.controller";
import { validateDto } from "../middleware/validationMiddleware";
import {
  CreateProductDto,
  DeleteProductDto,
  ProductDetailDto,
  UpdateProductDto,
} from "../dtos/product.dto";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

// Get all products
router.get("/all", listProducts);

// Export products to PDF
router.get("/export/pdf", exportProductsToPdf);

// Export products to Excel
router.get("/export/excel", exportProductsToExcel);

// Create a new product
router.post("/create", validateDto(CreateProductDto), createProduct);

// Update a product
router.post("/update", validateDto(UpdateProductDto), updateProduct);

// Delete a product
router.post("/delete", validateDto(DeleteProductDto), deleteProduct);

// Get product details
router.post("/detail", validateDto(ProductDetailDto), getProductDetail);

export default router;
