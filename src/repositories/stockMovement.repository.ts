import { db } from "../config/db";
import { stockMovements } from "../models/stockMovements";
import { products } from "../models/products";
import { akuns } from "../models/akun";
import { store } from "../models/store";
import { eq, sql, ilike, and, isNull, desc, asc, or } from "drizzle-orm";

export interface IStockMovementRepository {
  createStockMovement(data: {
    productId: number;
    movementType: "in" | "out";
    quantity: number;
    note?: string;
    akunId?: number;
    storeId?: number;
  }): Promise<void>;

  getStockMovementById(id: number): Promise<any>;

  listStockMovements(options: {
    page: number;
    limit: number;
    search?: string;
    movementType?: "in" | "out";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: any[]; total: number }>;
}

export class StockMovementRepository implements IStockMovementRepository {
  async createStockMovement(data: {
    productId: number;
    movementType: "in" | "out";
    quantity: number;
    note?: string;
    akunId?: number;
    storeId?: number;
  }): Promise<void> {
    await db.insert(stockMovements).values({
      ...data,
    });
  }

  async getStockMovementById(id: number): Promise<any> {
    const result = await db
      .select({
        id: stockMovements.id,
        productId: stockMovements.productId,
        productName: products.name,
        productSku: products.sku,
        productSatuan: products.satuan,
        movementType: stockMovements.movementType,
        quantity: stockMovements.quantity,
        note: stockMovements.note,
        akunId: stockMovements.akunId,
        akunName: akuns.name,
        storeId: stockMovements.storeId,
        storeName: store.name,
        createdAt: stockMovements.createdAt,
        updatedAt: stockMovements.updatedAt,
      })
      .from(stockMovements)
      .leftJoin(products, eq(stockMovements.productId, products.id))
      .leftJoin(akuns, eq(stockMovements.akunId, akuns.id))
      .leftJoin(store, eq(stockMovements.storeId, store.id))
      .where(and(eq(stockMovements.id, id), isNull(stockMovements.deletedAt)))
      .limit(1);

    return result[0];
  }

  async listStockMovements(options: {
    page: number;
    limit: number;
    search?: string;
    movementType?: "in" | "out";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: any[]; total: number }> {
    const {
      page,
      limit,
      search,
      movementType,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    // Define sorting logic
    let orderBy;
    switch (sortBy) {
      case "productName":
        orderBy =
          sortOrder === "asc" ? asc(products.name) : desc(products.name);
        break;
      case "quantity":
        orderBy =
          sortOrder === "asc"
            ? asc(stockMovements.quantity)
            : desc(stockMovements.quantity);
        break;
      case "movementType":
        orderBy =
          sortOrder === "asc"
            ? asc(stockMovements.movementType)
            : desc(stockMovements.movementType);
        break;
      default:
        orderBy =
          sortOrder === "asc"
            ? asc(stockMovements.createdAt)
            : desc(stockMovements.createdAt);
    }

    // Build where conditions
    let whereConditions = and(isNull(stockMovements.deletedAt));

    if (search) {
      whereConditions = and(
        whereConditions,
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.sku, `%${search}%`),
          ilike(stockMovements.note || "", `%${search}%`)
        )
      );
    }

    if (movementType) {
      whereConditions = and(
        whereConditions,
        eq(stockMovements.movementType, movementType)
      );
    }

    // Fetch data with pagination
    const data = await db
      .select({
        id: stockMovements.id,
        productId: stockMovements.productId,
        productName: products.name,
        productSku: products.sku,
        productSatuan: products.satuan,
        movementType: stockMovements.movementType,
        quantity: stockMovements.quantity,
        note: stockMovements.note,
        akunId: stockMovements.akunId,
        akunName: akuns.name,
        storeId: stockMovements.storeId,
        storeName: store.name,
        createdAt: stockMovements.createdAt,
        updatedAt: stockMovements.updatedAt,
      })
      .from(stockMovements)
      .leftJoin(products, eq(stockMovements.productId, products.id))
      .leftJoin(akuns, eq(stockMovements.akunId, akuns.id))
      .leftJoin(store, eq(stockMovements.storeId, store.id))
      .where(whereConditions)
      .orderBy(orderBy)
      .limit(limit)
      .offset((page - 1) * limit);

    // Get total count for pagination
    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(stockMovements)
      .where(whereConditions);

    return {
      data,
      total: total.count,
    };
  }
}
