import { quotationStatus } from "../models/quotation";
import quotationRepository from "../repositories/quotationRepository";
import { pagination } from "../utils/helper";
import { db } from "../config/db";
import { stockMovements } from "../models/stockMovements";
import { products } from "../models/products";
import { eq, sql, inArray } from "drizzle-orm";

export class QuotationService {
  async createQuotation(quotationData: any, quotationDetailsData: any[]) {
    // Generate quotation number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    // Get random 4 digit number
    const random = Math.floor(1000 + Math.random() * 9000);

    const quotationNumber = `QT-${year}${month}${day}-${random}`;

    // Calculate totals
    let subtotal = 0;
    const processedDetails = quotationDetailsData.map((detail) => {
      const itemSubtotal =
        detail.quantity * detail.unitPrice * (1 - (detail.discount || 0) / 100);
      subtotal += itemSubtotal;

      return {
        ...detail,
        subtotal: itemSubtotal,
      };
    });

    const grandTotal = subtotal - (quotationData.discountAmount || 0);

    const quotationWithCalculations = {
      ...quotationData,
      quotationNumber,
      subtotal,
      grandTotal,
    };

    return await quotationRepository.create(
      quotationWithCalculations,
      processedDetails
    );
  }

  async getAllQuotations(options: {
    page: number;
    limit: number;
    search?: string;
    status?: (typeof quotationStatus.enumValues)[number];
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const result = await quotationRepository.findAll(options);
    const paginationResult = await pagination(
      result.total,
      options.page,
      options.limit
    );

    return {
      data: result.data,
      pagination: paginationResult,
    };
  }

  async getQuotationById(id: number) {
    return await quotationRepository.findById(id);
  }

  async updateQuotationStatus(
    id: number,
    status: (typeof quotationStatus.enumValues)[number]
  ) {
    // Get the current status of the quotation
    const currentStatus = await quotationRepository.getQuotationStatus(id);

    if (!currentStatus) {
      throw new Error("Quotation not found");
    }

    // Business rule: Cannot reject if status is already accepted
    if (status === "rejected" && currentStatus === "accepted") {
      throw new Error("Cannot reject quotation that has already been accepted");
    }

    // If changing status to accepted, handle stock movements
    if (status === "accepted" && currentStatus !== "accepted") {
      await this.handleStockMovementsOnAccept(id);
    }

    // Additional business rules could be added here
    // For example:
    // - Cannot update status if already converted
    // - Only allow specific status transitions

    return await quotationRepository.updateStatus(id, status);
  }

  private async handleStockMovementsOnAccept(quotationId: number) {
    // Get the quotation details with associated products
    const quotation = await quotationRepository.findById(quotationId);
    if (!quotation) {
      throw new Error("Quotation not found");
    }

    // First check if all products have enough stock
    const productStocks = await this.checkProductStock(quotation.details);
    const insufficientStockProducts = productStocks.filter(
      (p) => p.stock < p.requestedQuantity
    );

    if (insufficientStockProducts.length > 0) {
      const productList = insufficientStockProducts
        .map(
          (p) =>
            `${p.productName} (Available: ${p.stock}, Requested: ${p.requestedQuantity})`
        )
        .join(", ");

      throw new Error(
        `Insufficient stock for the following products: ${productList}`
      );
    }

    // Process each product in the quotation details
    await db.transaction(async (tx) => {
      for (const detail of quotation.details) {
        // Create stock movement record (OUT)
        await tx.insert(stockMovements).values({
          productId: detail.productId,
          movementType: "out",
          quantity: detail.quantity,
          note: `Quotation accepted: ${quotation.quotationNumber}`,
          akunId: quotation.customerId,
          storeId: quotation.storeId,
        });

        // Update product stock (decrease)
        await tx
          .update(products)
          .set({
            stock: sql`${products.stock} - ${detail.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, detail.productId));
      }
    });
  }

  private async checkProductStock(quotationDetails: any[]) {
    const productIds = quotationDetails.map((detail) => detail.productId);

    if (productIds.length === 0) {
      return [];
    }

    // Get current stock levels for all products in the quotation using inArray
    const allProductStocks = await db
      .select({
        id: products.id,
        name: products.name,
        stock: products.stock,
      })
      .from(products)
      .where(inArray(products.id, productIds));

    // Map the requested quantities to each product
    return allProductStocks.map((product) => {
      const detail = quotationDetails.find((d) => d.productId === product.id);
      return {
        productId: product.id,
        productName: product.name,
        stock: Number(product.stock),
        requestedQuantity: detail ? Number(detail.quantity) : 0,
      };
    });
  }
}

export default new QuotationService();
