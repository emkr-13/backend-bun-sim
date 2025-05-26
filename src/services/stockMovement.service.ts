import logger from "../utils/logger";
import { IStockMovementRepository } from "../repositories/stockMovement.repository";
import { db } from "../config/db";
import { products } from "../models/products";
import { eq } from "drizzle-orm";

export class StockMovementService {
  constructor(
    private readonly stockMovementRepository: IStockMovementRepository
  ) {}

  async createStockMovement(data: {
    productId: number;
    movementType: "in" | "out";
    quantity: number;
    note?: string;
    akunId?: number;
    storeId?: number;
  }): Promise<void> {
    // Validate product exists
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, data.productId));

    if (!product) {
      throw new Error("Product not found");
    }

    // Create the stock movement
    await this.stockMovementRepository.createStockMovement(data);

    // Update product stock based on movement type
    await db.transaction(async (tx) => {
      const [currentProduct] = await tx
        .select({ stock: products.stock })
        .from(products)
        .where(eq(products.id, data.productId));

      const newStock =
        data.movementType === "in"
          ? (currentProduct.stock || 0) + data.quantity
          : (currentProduct.stock || 0) - data.quantity;

      // Validate stock doesn't go negative for "out" movements
      if (data.movementType === "out" && newStock < 0) {
        throw new Error("Insufficient stock for the requested movement");
      }

      await tx
        .update(products)
        .set({
          stock: newStock,
          updatedAt: new Date(),
        })
        .where(eq(products.id, data.productId));
    });

    logger.info(
      `Stock movement created successfully for product ID: ${data.productId}`
    );
  }

  async getStockMovementDetail(id: number): Promise<any> {
    if (!id) {
      throw new Error("id is required");
    }

    const stockMovement =
      await this.stockMovementRepository.getStockMovementById(id);

    if (!stockMovement) {
      throw new Error("Stock movement not found");
    }

    return stockMovement;
  }

  async listStockMovements(options: {
    page: number;
    limit: number;
    search?: string;
    movementType?: "in" | "out";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10 } = options;

    const result = await this.stockMovementRepository.listStockMovements({
      ...options,
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      ...result,
      page,
      limit,
      totalPages,
    };
  }
}
