import { db } from "../config/db";
import { akuns } from "../models/akun";
import { eq, sql, ilike, and, isNull, desc, asc } from "drizzle-orm";

export interface IAkunRepository {
  createAkun(data: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    type: "customer" | "supplier";
  }): Promise<void>;

  updateAkun(
    id: number,
    data: {
      name?: string;
      phone?: string;
      email?: string;
      address?: string;
      type?: "customer" | "supplier";
    }
  ): Promise<void>;

  softDeleteAkun(id: number): Promise<void>;
  getAkunById(id: number): Promise<any>;
  listAkuns(options: {
    page: number;
    limit: number;
    search?: string;
    type?: "customer" | "supplier";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: any[]; total: number }>;

  akunExistsByEmail(email: string): Promise<boolean>;
  akunExistsById(id: number): Promise<boolean>;
}

export class AkunRepository implements IAkunRepository {
  async createAkun(data: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    type: "customer" | "supplier";
  }): Promise<void> {
    await db.insert(akuns).values(data);
  }

  async updateAkun(
    id: number,
    data: {
      name?: string;
      phone?: string;
      email?: string;
      address?: string;
      type?: "customer" | "supplier";
    }
  ): Promise<void> {
    await db
      .update(akuns)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(akuns.id, id));
  }

  async softDeleteAkun(id: number): Promise<void> {
    await db
      .update(akuns)
      .set({ deletedAt: new Date() })
      .where(eq(akuns.id, id));
  }

  async getAkunById(id: number): Promise<any> {
    const [akun] = await db.select().from(akuns).where(eq(akuns.id, id));
    return akun;
  }

  async listAkuns(options: {
    page: number;
    limit: number;
    search?: string;
    type?: "customer" | "supplier";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: any[]; total: number }> {
    const {
      page,
      limit,
      search,
      type,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const orderBy =
      sortBy === "name"
        ? sortOrder === "asc"
          ? asc(akuns.name)
          : desc(akuns.name)
        : sortOrder === "asc"
        ? asc(akuns.createdAt)
        : desc(akuns.createdAt);

    let whereConditions = and(isNull(akuns.deletedAt));
    if (search) {
      whereConditions = and(whereConditions, ilike(akuns.name, `%${search}%`));
    }
    if (type) {
      whereConditions = and(whereConditions, eq(akuns.type, type));
    }

    const data = await db
      .select()
      .from(akuns)
      .where(whereConditions)
      .orderBy(orderBy)
      .limit(limit)
      .offset((page - 1) * limit);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(akuns)
      .where(whereConditions);

    return {
      data,
      total: total.count,
    };
  }

  async akunExistsByEmail(email: string): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(akuns)
      .where(eq(akuns.email, email));
    return !!existing;
  }

  async akunExistsById(id: number): Promise<boolean> {
    const [existing] = await db.select().from(akuns).where(eq(akuns.id, id));
    return !!existing;
  }
}
