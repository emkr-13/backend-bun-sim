import { db } from "../config/db";
import { store } from "../models/store";
import { eq, sql, ilike, and, isNull, desc, asc } from "drizzle-orm";

export interface IStoreRepository {
  createStore(data: {
    name: string;
    description?: string;
    location?: string;
    manager?: string;
    contactInfo?: string;
    phone?: string;
    email?: string;
    address?: string;
  }): Promise<void>;
  
  updateStore(id: number, data: {
    name?: string;
    description?: string;
    location?: string;
    manager?: string;
    contactInfo?: string;
    phone?: string;
    email?: string;
    address?: string;
  }): Promise<void>;
  
  deleteStore(id: number): Promise<void>;
  getStoreById(id: number): Promise<any>;
  listStores(options: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: any[]; total: number }>;
  
  storeExistsByName(name: string): Promise<boolean>;
  storeExistsById(id: number): Promise<boolean>;
}

export class StoreRepository implements IStoreRepository {
  async createStore(data: {
    name: string;
    description?: string;
    location?: string;
    manager?: string;
    contactInfo?: string;
    phone?: string;
    email?: string;
    address?: string;
  }): Promise<void> {
    await db.insert(store).values(data);
  }

  async updateStore(id: number, data: {
    name?: string;
    description?: string;
    location?: string;
    manager?: string;
    contactInfo?: string;
    phone?: string;
    email?: string;
    address?: string;
  }): Promise<void> {
    await db
      .update(store)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(store.id, id));
  }

  async deleteStore(id: number): Promise<void> {
    await db
      .delete(store)
      .where(eq(store.id, id));
  }

  async getStoreById(id: number): Promise<any> {
    const [storeData] = await db
      .select()
      .from(store)
      .where(eq(store.id, id));
    return storeData;
  }

  async listStores(options: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: any[]; total: number }> {
    const { page, limit, search, sortBy = 'createdAt', sortOrder = 'desc' } = options;

    const orderBy = sortBy === 'name' 
      ? sortOrder === 'asc' ? asc(store.name) : desc(store.name)
      : sortOrder === 'asc' ? asc(store.createdAt) : desc(store.createdAt);

    const whereCondition = search
      ? and(
          ilike(store.name, `%${search}%`),
          isNull(store.deletedAt)
        )
      : isNull(store.deletedAt);

    const data = await db
      .select()
      .from(store)
      .where(whereCondition)
      .orderBy(orderBy)
      .limit(limit)
      .offset((page - 1) * limit);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(store)
      .where(whereCondition);

    return {
      data,
      total: total.count
    };
  }

  async storeExistsByName(name: string): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(store)
      .where(eq(store.name, name));
    return !!existing;
  }

  async storeExistsById(id: number): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(store)
      .where(eq(store.id, id));
    return !!existing;
  }
}