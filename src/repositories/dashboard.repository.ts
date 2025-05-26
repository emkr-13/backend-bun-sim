import { db } from "../config/db";
import { sql, and, eq, gte, isNull } from "drizzle-orm";
import { akuns } from "../models/akun";
import { store } from "../models/store";
import { products } from "../models/products";
import { quotations } from "../models/quotation";
import { purchases } from "../models/purchase";
import { stockMovements } from "../models/stockMovements";
import { TimeFilterType } from "../dtos/dashboard.dto";

export interface IDashboardRepository {
  getSummaryGeneral(): Promise<{
    total_customers: number;
    total_suppliers: number;
    total_stores: number;
    total_products: number;
  }>;

  getSummarySpecific(timeFilter?: TimeFilterType): Promise<{
    total_quotations: number;
    total_purchases: number;
    total_stock_movements_in: number;
    total_stock_movements_out: number;
  }>;
}

export class DashboardRepository implements IDashboardRepository {
  async getSummaryGeneral() {
    // Get total customers
    const [customersResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(akuns)
      .where(and(eq(akuns.type, "customer"), isNull(akuns.deletedAt)));

    // Get total suppliers
    const [suppliersResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(akuns)
      .where(and(eq(akuns.type, "supplier"), isNull(akuns.deletedAt)));

    // Get total stores
    const [storesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(store)
      .where(isNull(store.deletedAt));

    // Get total products
    const [productsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(isNull(products.deletedAt));

    return {
      total_customers: customersResult.count,
      total_suppliers: suppliersResult.count,
      total_stores: storesResult.count,
      total_products: productsResult.count,
    };
  }

  async getSummarySpecific(timeFilter?: TimeFilterType) {
    // Calculate date range based on timeFilter
    const dateRange = this.getDateRangeFromFilter(timeFilter);
    const startDateStr = dateRange.startDate.toISOString();

    // Get total quotations in the specified time range
    const [quotationsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(quotations)
      .where(
        and(
          isNull(quotations.deletedAt),
          gte(quotations.quotationDate, sql`${startDateStr}::date`)
        )
      );

    // Get total purchases in the specified time range
    const [purchasesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(purchases)
      .where(
        and(
          isNull(purchases.deletedAt),
          gte(purchases.purchaseDate, sql`${startDateStr}::timestamp`)
        )
      );

    // Get total stock movements (IN) in the specified time range
    const [stockMovementsInResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(stockMovements)
      .where(
        and(
          isNull(stockMovements.deletedAt),
          eq(stockMovements.movementType, "in"),
          gte(stockMovements.createdAt, sql`${startDateStr}::timestamp`)
        )
      );

    // Get total stock movements (OUT) in the specified time range
    const [stockMovementsOutResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(stockMovements)
      .where(
        and(
          isNull(stockMovements.deletedAt),
          eq(stockMovements.movementType, "out"),
          gte(stockMovements.createdAt, sql`${startDateStr}::timestamp`)
        )
      );

    return {
      total_quotations: quotationsResult.count,
      total_purchases: purchasesResult.count,
      total_stock_movements_in: stockMovementsInResult.count,
      total_stock_movements_out: stockMovementsOutResult.count,
    };
  }

  private getDateRangeFromFilter(timeFilter?: TimeFilterType) {
    const now = new Date();
    let startDate: Date;

    switch (timeFilter) {
      case "today":
        // Start of today
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "last_week":
        // 7 days ago
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "last_two_weeks":
        // 14 days ago
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 14);
        break;
      case "this_month":
        // Start of current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        // Default to today if no filter provided
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    return {
      startDate,
      endDate: now,
    };
  }
}
