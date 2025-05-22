import { and, eq, isNull, ilike, desc, asc, sql, or, SQL } from "drizzle-orm";
import { db } from "../config/db";
import { purchases, purchaseStatus } from "../models/purchase";
import { purchaseDetails } from "../models/purchaseDetail";
import { products } from "../models/products";
import { akuns } from "../models/akun";
import { store } from "../models/store";

export class PurchaseRepository {
  async create(purchaseData: any, purchaseDetailsData: any[]) {
    return await db.transaction(async (tx: any) => {
      const [newPurchase] = await tx
        .insert(purchases)
        .values(purchaseData)
        .returning();

      const detailsWithPurchaseId = purchaseDetailsData.map((detail) => ({
        ...detail,
        purchaseId: newPurchase.id,
      }));

      const newDetails = await tx
        .insert(purchaseDetails)
        .values(detailsWithPurchaseId)
        .returning();

      return {
        ...newPurchase,
        details: newDetails,
      };
    });
  }

  async findAll(options: {
    page: number;
    limit: number;
    search?: string;
    status?: (typeof purchaseStatus.enumValues)[number];
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
    let whereConditions: SQL<unknown> = sql`${purchases.deletedAt} IS NULL`;

    if (search) {
      whereConditions = sql`${whereConditions} AND (
        ${purchases.invoiceNumber} ILIKE ${"%" + search + "%"} OR
        ${akuns.name} ILIKE ${"%" + search + "%"} OR
        ${store.name} ILIKE ${"%" + search + "%"}
      )`;
    }

    if (status) {
      whereConditions = sql`${whereConditions} AND ${purchases.status} = ${status}`;
    }

    // Determine order by
    const orderByField =
      sortBy === "invoiceNumber"
        ? purchases.invoiceNumber
        : sortBy === "purchaseDate"
        ? purchases.purchaseDate
        : sortBy === "grandTotal"
        ? purchases.grandTotal
        : sortBy === "status"
        ? purchases.status
        : purchases.createdAt;

    const orderByDirection =
      sortOrder === "asc" ? asc(orderByField) : desc(orderByField);

    // Execute query with joins to get supplier and store names
    const data = await db
      .select({
        id: purchases.id,
        invoiceNumber: purchases.invoiceNumber,
        purchaseDate: purchases.purchaseDate,
        supplierId: purchases.supplierId,
        supplierName: akuns.name,
        storeId: purchases.storeId,
        storeName: store.name,
        totalAmount: purchases.totalAmount,
        discountAmount: purchases.discountAmount,
        grandTotal: purchases.grandTotal,
        status: purchases.status,
        notes: purchases.notes,
        paymentDueDate: purchases.paymentDueDate,
        paymentTerm: purchases.paymentTerm,
        createdAt: purchases.createdAt,
        updatedAt: purchases.updatedAt,
      })
      .from(purchases)
      .leftJoin(akuns, eq(purchases.supplierId, akuns.id))
      .leftJoin(store, eq(purchases.storeId, store.id))
      .where(whereConditions)
      .orderBy(orderByDirection)
      .limit(limit)
      .offset((page - 1) * limit);

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(purchases)
      .where(whereConditions);

    return {
      data,
      total: totalResult.count,
    };
  }

  async findById(id: number) {
    const purchase = await db
      .select({
        id: purchases.id,
        invoiceNumber: purchases.invoiceNumber,
        purchaseDate: purchases.purchaseDate,
        supplierId: purchases.supplierId,
        supplierName: akuns.name,
        storeId: purchases.storeId,
        storeName: store.name,
        totalAmount: purchases.totalAmount,
        discountAmount: purchases.discountAmount,
        grandTotal: purchases.grandTotal,
        status: purchases.status,
        notes: purchases.notes,
        paymentDueDate: purchases.paymentDueDate,
        paymentTerm: purchases.paymentTerm,
        createdAt: purchases.createdAt,
        updatedAt: purchases.updatedAt,
      })
      .from(purchases)
      .leftJoin(akuns, eq(purchases.supplierId, akuns.id))
      .leftJoin(store, eq(purchases.storeId, store.id))
      .where(and(eq(purchases.id, id), isNull(purchases.deletedAt)))
      .limit(1);

    if (purchase.length === 0) {
      return null;
    }

    const details = await db
      .select({
        id: purchaseDetails.id,
        productId: purchaseDetails.productId,
        productName: products.name,
        quantity: purchaseDetails.quantity,
        satuan: products.satuan,
        unitPrice: purchaseDetails.unitPrice,
        discount: purchaseDetails.discount,
        subtotal: purchaseDetails.subtotal,
        notes: purchaseDetails.notes,
      })
      .from(purchaseDetails)
      .leftJoin(products, eq(purchaseDetails.productId, products.id))
      .where(eq(purchaseDetails.purchaseId, id));

    return {
      ...purchase[0],
      details,
    };
  }

  async getPurchaseStatus(id: number) {
    const result = await db
      .select({ status: purchases.status })
      .from(purchases)
      .where(and(eq(purchases.id, id), isNull(purchases.deletedAt)))
      .limit(1);

    return result.length > 0 ? result[0].status : null;
  }

  async updateStatus(
    id: number,
    status: (typeof purchaseStatus.enumValues)[number]
  ) {
    return await db
      .update(purchases)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(and(eq(purchases.id, id), isNull(purchases.deletedAt)))
      .returning();
  }
}

const purchaseRepository = new PurchaseRepository();
export default purchaseRepository;
