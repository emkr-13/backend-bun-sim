import { and, eq, isNull, ilike, desc, asc, sql, or, SQL } from "drizzle-orm";
import { db } from "../config/db";
import { quotations, quotationStatus } from "../models/quotation";
import { quotationDetails } from "../models/quotationDetail";
import { products } from "../models/products";
import { akuns } from "../models/akun";
import { store } from "../models/store";

export class QuotationRepository {
  async create(quotationData: any, quotationDetailsData: any[]) {
    return await db.transaction(async (tx: any) => {
      const [newQuotation] = await tx
        .insert(quotations)
        .values(quotationData)
        .returning();

      const detailsWithQuotationId = quotationDetailsData.map((detail) => ({
        ...detail,
        quotationId: newQuotation.id,
      }));

      const newDetails = await tx
        .insert(quotationDetails)
        .values(detailsWithQuotationId)
        .returning();

      return {
        ...newQuotation,
        details: newDetails,
      };
    });
  }

  async findAll(options: {
    page: number;
    limit: number;
    search?: string;
    status?: (typeof quotationStatus.enumValues)[number];
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const {
      page,
      limit,
      search,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    // Start with a base condition
    let whereConditions: SQL<unknown> = sql`${quotations.deletedAt} IS NULL`;

    if (search) {
      whereConditions = sql`${whereConditions} AND (
        ${quotations.quotationNumber} ILIKE ${"%" + search + "%"} OR
        ${akuns.name} ILIKE ${"%" + search + "%"} OR
        ${store.name} ILIKE ${"%" + search + "%"}
      )`;
    }

    if (status) {
      whereConditions = sql`${whereConditions} AND ${quotations.status} = ${status}`;
    }

    // Determine order by
    const orderByField =
      sortBy === "quotationNumber"
        ? quotations.quotationNumber
        : sortBy === "quotationDate"
        ? quotations.quotationDate
        : sortBy === "grandTotal"
        ? quotations.grandTotal
        : sortBy === "status"
        ? quotations.status
        : quotations.createdAt;

    const orderByDirection =
      sortOrder === "asc" ? asc(orderByField) : desc(orderByField);

    // Execute query with joins to get customer and store names
    const data = await db
      .select({
        id: quotations.id,
        quotationNumber: quotations.quotationNumber,
        quotationDate: quotations.quotationDate,
        customerId: quotations.customerId,
        customerName: akuns.name,
        storeId: quotations.storeId,
        storeName: store.name,
        subtotal: quotations.subtotal,
        discountAmount: quotations.discountAmount,
        grandTotal: quotations.grandTotal,
        status: quotations.status,
        notes: quotations.notes,
        createdAt: quotations.createdAt,
        updatedAt: quotations.updatedAt,
      })
      .from(quotations)
      .leftJoin(akuns, eq(quotations.customerId, akuns.id))
      .leftJoin(store, eq(quotations.storeId, store.id))
      .where(whereConditions)
      .orderBy(orderByDirection)
      .limit(limit)
      .offset((page - 1) * limit);

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(quotations)
      .where(whereConditions);

    return {
      data,
      total: totalResult.count,
    };
  }

  async findById(id: number) {
    const quotation = await db
      .select({
        id: quotations.id,
        quotationNumber: quotations.quotationNumber,
        quotationDate: quotations.quotationDate,
        customerId: quotations.customerId,
        customerName: akuns.name,
        storeId: quotations.storeId,
        storeName: store.name,
        subtotal: quotations.subtotal,
        discountAmount: quotations.discountAmount,
        grandTotal: quotations.grandTotal,
        status: quotations.status,
        notes: quotations.notes,
        createdAt: quotations.createdAt,
        updatedAt: quotations.updatedAt,
      })
      .from(quotations)
      .leftJoin(akuns, eq(quotations.customerId, akuns.id))
      .leftJoin(store, eq(quotations.storeId, store.id))
      .where(and(eq(quotations.id, id), isNull(quotations.deletedAt)))
      .limit(1);

    if (quotation.length === 0) {
      return null;
    }

    const details = await db
      .select({
        id: quotationDetails.id,
        productId: quotationDetails.productId,
        productName: products.name,
        quantity: quotationDetails.quantity,
        unitPrice: quotationDetails.unitPrice,
        discount: quotationDetails.discount,
        subtotal: quotationDetails.subtotal,
        description: quotationDetails.description,
        notes: quotationDetails.notes,
      })
      .from(quotationDetails)
      .leftJoin(products, eq(quotationDetails.productId, products.id))
      .where(eq(quotationDetails.quotationId, id));

    return {
      ...quotation[0],
      details,
    };
  }

  async getQuotationStatus(id: number) {
    const result = await db
      .select({ status: quotations.status })
      .from(quotations)
      .where(and(eq(quotations.id, id), isNull(quotations.deletedAt)))
      .limit(1);

    return result.length > 0 ? result[0].status : null;
  }

  async updateStatus(
    id: number,
    status: (typeof quotationStatus.enumValues)[number]
  ) {
    return await db
      .update(quotations)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(and(eq(quotations.id, id), isNull(quotations.deletedAt)))
      .returning();
  }
}

export default new QuotationRepository();
