import { db } from "../config/db";
import { categories } from "../models/categories";
import { eq, sql, ilike, and, isNull, desc, asc } from "drizzle-orm";


export interface ICategoryRepository {
  createCategory(data: { name: string; description?: string }): Promise<void>;
  updateCategory(
    id: number,
    data: { name?: string; description?: string }
  ): Promise<void>;
  softDeleteCategory(id: number): Promise<void>;
  getCategoryById(id: number): Promise<any>;
  listCategories(options: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: any[]; total: number }>;
  categoryExists(name: string): Promise<boolean>;
  categoryExistsById(id: number): Promise<boolean>;
}

export class CategoryRepository implements ICategoryRepository {
  async createCategory(data: {
    name: string;
    description?: string;
  }): Promise<void> {
    await db.insert(categories).values(data);
  }

  async updateCategory(
    id: number,
    data: { name?: string; description?: string }
  ): Promise<void> {
    await db.update(categories).set(data).where(eq(categories.id, id));
  }

  async softDeleteCategory(id: number): Promise<void> {
    await db
      .update(categories)
      .set({ deletedAt: new Date() })
      .where(eq(categories.id, id));
  }

  async getCategoryById(id: number): Promise<any> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return category;
  }
  async listCategories(options: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: any[]; total: number }> {
    const {
      page,
      limit,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const orderBy =
      sortBy === "name"
        ? sortOrder === "asc"
          ? asc(categories.name)
          : desc(categories.name)
        : sortOrder === "asc"
        ? asc(categories.createdAt)
        : desc(categories.createdAt);

    const whereCondition = search
      ? and(isNull(categories.deletedAt), ilike(categories.name, `%${search}%`))
      : isNull(categories.deletedAt);

    const data = await db
      .select()
      .from(categories)
      .where(whereCondition)
      .orderBy(orderBy)
      .limit(limit)
      .offset((page - 1) * limit);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .where(whereCondition);

    return {
      data,
      total: total.count,
    };
  }

  async categoryExists(name: string): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name));
    return !!existing;
  }

  async categoryExistsById(id: number): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return !!existing;
  }
}
