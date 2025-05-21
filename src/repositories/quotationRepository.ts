import { and, eq, isNull } from "drizzle-orm";
import { db } from "../config/db";
import { quotations, quotationStatus } from "../models/quotation";
import { quotationDetails } from "../models/quotationDetail";
import { products } from "../models/products";

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

  async findAll() {
    return await db
      .select({
        id: quotations.id,
        quotationNumber: quotations.quotationNumber,
        quotationDate: quotations.quotationDate,
        customerId: quotations.customerId,
        storeId: quotations.storeId,
        subtotal: quotations.subtotal,
        discountAmount: quotations.discountAmount,
        grandTotal: quotations.grandTotal,
        status: quotations.status,
        notes: quotations.notes,
        createdAt: quotations.createdAt,
        updatedAt: quotations.updatedAt,
      })
      .from(quotations)
      .where(isNull(quotations.deletedAt));
  }

  async findById(id: number) {
    const quotation = await db
      .select()
      .from(quotations)
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
