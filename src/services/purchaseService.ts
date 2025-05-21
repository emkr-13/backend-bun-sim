import { purchaseStatus } from "../models/purchase";
import purchaseRepository from "../repositories/purchaseRepository";
import { pagination } from "../utils/helper";
import { db } from "../config/db";
import { stockMovements } from "../models/stockMovements";
import { products } from "../models/products";
import { eq, sql } from "drizzle-orm";

export class PurchaseService {
  async createPurchase(purchaseData: any, purchaseDetailsData: any[]) {
    // Generate invoice number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    // Get random 4 digit number
    const random = Math.floor(1000 + Math.random() * 9000);

    const invoiceNumber = `PO-${year}${month}${day}-${random}`;

    // Calculate totals
    let totalAmount = 0;
    const processedDetails = purchaseDetailsData.map((detail) => {
      const itemSubtotal =
        detail.quantity * detail.unitPrice * (1 - (detail.discount || 0) / 100);
      totalAmount += itemSubtotal;

      return {
        ...detail,
        subtotal: itemSubtotal,
      };
    });

    const grandTotal = totalAmount - (purchaseData.discountAmount || 0);

    const purchaseWithCalculations = {
      ...purchaseData,
      invoiceNumber,
      totalAmount,
      grandTotal,
    };

    return await purchaseRepository.create(
      purchaseWithCalculations,
      processedDetails
    );
  }

  async getAllPurchases(options: {
    page: number;
    limit: number;
    search?: string;
    status?: (typeof purchaseStatus.enumValues)[number];
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const result = await purchaseRepository.findAll(options);
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

  async getPurchaseById(id: number) {
    return await purchaseRepository.findById(id);
  }

  async updatePurchaseStatus(
    id: number,
    status: (typeof purchaseStatus.enumValues)[number]
  ) {
    // Get the current status of the purchase
    const currentStatus = await purchaseRepository.getPurchaseStatus(id);

    if (!currentStatus) {
      throw new Error("Purchase not found");
    }

    // Business rule: Cannot cancel if status is already received
    if (status === "cancelled" && currentStatus === "received") {
      throw new Error("Cannot cancel purchase that has already been received");
    }

    // If changing status to received, handle stock movements
    if (status === "received" && currentStatus !== "received") {
      await this.handleStockMovementsOnReceive(id);
    }

    // Additional business rules could be added here
    // For example:
    // - Cannot update status if already paid
    // - Only allow specific status transitions

    return await purchaseRepository.updateStatus(id, status);
  }

  private async handleStockMovementsOnReceive(purchaseId: number) {
    // Get the purchase details with associated products
    const purchase = await purchaseRepository.findById(purchaseId);
    if (!purchase) {
      throw new Error("Purchase not found");
    }

    // Process each product in the purchase details
    await db.transaction(async (tx) => {
      for (const detail of purchase.details) {
        // Create stock movement record (IN)
        await tx.insert(stockMovements).values({
          productId: detail.productId,
          movementType: "in",
          quantity: detail.quantity,
          note: `Purchase received: ${purchase.invoiceNumber}`,
          akunId: purchase.supplierId,
          storeId: purchase.storeId,
        });

        // Update product stock (increase)
        await tx
          .update(products)
          .set({
            stock: sql`${products.stock} + ${detail.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, detail.productId));
      }
    });
  }
}

const purchaseService = new PurchaseService();
export default purchaseService;
