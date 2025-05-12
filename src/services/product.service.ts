import { IProductRepository } from "../repositories/product.repository";
import logger from "../utils/logger";
import { pagination } from "../utils/helper";

export class ProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async createProduct(data: {
    name: string;
    description?: string;
    sku: string;
    stock: number;
    categoryId: number;
    price_sell: string;
    price_cost: string;
  }) {
    if (
      !data.name ||
      !data.sku ||
      !data.categoryId ||
      !data.price_sell ||
      !data.price_cost
    ) {
      throw new Error(
        "Required fields: name, sku, categoryId, price_sell, price_cost"
      );
    }

    if (await this.productRepository.productExistsBySku(data.sku)) {
      throw new Error("Product with this SKU already exists");
    }

    if (data.stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    await this.productRepository.createProduct(data);
    logger.info("Product created successfully");
  }

  async updateProduct(
    id: number,
    data: {
      name?: string;
      description?: string;
      sku?: string;
      stock?: number;
      categoryId?: number;
      price_sell?: string;
      price_cost?: string;
    }
  ) {
    if (!id) {
      throw new Error("id is required");
    }

    if (!(await this.productRepository.productExistsById(id))) {
      throw new Error("Product not found");
    }

    if (
      data.sku &&
      (await this.productRepository.productExistsBySku(data.sku))
    ) {
      const existingProduct = await this.productRepository.getProductById(id);
      if (existingProduct.sku !== data.sku) {
        throw new Error("Another product with this SKU already exists");
      }
    }

    if (data.stock && data.stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    await this.productRepository.updateProduct(id, data);
    logger.info("Product updated successfully");
  }

  async deleteProduct(id: number) {
    if (!id) {
      throw new Error("id is required");
    }

    if (!(await this.productRepository.productExistsById(id))) {
      throw new Error("Product not found");
    }

    await this.productRepository.softDeleteProduct(id);
    logger.info("Product deleted successfully");
  }

  async getProductDetail(id: number) {
    if (!id) {
      throw new Error("id is required");
    }

    const product = await this.productRepository.getProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    logger.info("Product details retrieved successfully");
    return product;
  }

  async listProducts(options: {
    page: number;
    limit: number;
    search?: string;
    categoryId?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const result = await this.productRepository.listProducts(options);
    const paginationResult = await pagination(
      result.total,
      options.page,
      options.limit
    );

    logger.info("Products retrieved successfully");
    return {
      data: result.data,
      pagination: paginationResult,
    };
  }
}
