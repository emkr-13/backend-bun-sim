import { db } from "../config/db";
import { products } from "../models/products";
import { eq, sql, ilike, and, isNull, desc, asc } from "drizzle-orm";

export interface IProductRepository {
  createProduct(data: {
    name: string;
    description?: string;
    sku: string;
    stock: number;
    categoryId: number;
    price_sell: string;
    price_cost: string;
  }): Promise<void>;

  updateProduct(
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
  ): Promise<void>;

  softDeleteProduct(id: number): Promise<void>;
  getProductById(id: number): Promise<any>;
  listProducts(options: {
    page: number;
    limit: number;
    search?: string;
    categoryId?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: any[]; total: number }>;

  productExistsBySku(sku: string): Promise<boolean>;
  productExistsById(id: number): Promise<boolean>;
}

export class ProductRepository implements IProductRepository {
  async createProduct(data: {
    name: string;
    description?: string;
    sku: string;
    stock: number;
    categoryId: number;
    price_sell: string;
    price_cost: string;
  }): Promise<void> {
    await db.insert(products).values(data);
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
  ): Promise<void> {
    await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id));
  }

  async softDeleteProduct(id: number): Promise<void> {
    await db
      .update(products)
      .set({ deletedAt: new Date() })
      .where(eq(products.id, id));
  }

  async getProductById(id: number): Promise<any> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product;
  }

  async listProducts(options: {
    page: number;
    limit: number;
    search?: string;
    categoryId?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: any[]; total: number }> {
    const {
      page,
      limit,
      search,
      categoryId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const orderBy =
      sortBy === "name"
        ? sortOrder === "asc"
          ? asc(products.name)
          : desc(products.name)
        : sortOrder === "asc"
        ? asc(products.createdAt)
        : desc(products.createdAt);

    let whereConditions = and(isNull(products.deletedAt));
    if (search) {
      whereConditions = and(
        whereConditions,
        ilike(products.name, `%${search}%`)
      );
    }
    if (categoryId) {
      whereConditions = and(
        whereConditions,
        eq(products.categoryId, categoryId)
      );
    }

    const data = await db
      .select()
      .from(products)
      .where(whereConditions)
      .orderBy(orderBy)
      .limit(limit)
      .offset((page - 1) * limit);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereConditions);

    return {
      data,
      total: total.count,
    };
  }

  async productExistsBySku(sku: string): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(products)
      .where(eq(products.sku, sku));
    return !!existing;
  }

  async productExistsById(id: number): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return !!existing;
  }
}
