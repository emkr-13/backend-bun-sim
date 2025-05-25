import { db } from "../config/db";
import { quotations } from "../models/quotation";
import { purchases } from "../models/purchase";
import { akuns } from "../models/akun";
import { store } from "../models/store";
import { and, between, eq, gte, isNull, lte, sum, sql } from "drizzle-orm";
import { DateFilterType } from "../dtos/report.dto";
import logger from "../utils/logger";

export class ReportRepository {
  async getQuotationsReport(filterOptions: {
    filterType: DateFilterType;
    startDate?: Date;
    endDate?: Date;
  }) {
    let dateFilter;
    logger.info(
      `Generating quotations report with filter: ${filterOptions.filterType}`
    );

    switch (filterOptions.filterType) {
      case DateFilterType.TODAY:
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Format as YYYY-MM-DD for date column
        const todayFormatted = today.toISOString().split("T")[0];
        const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

        logger.info(`Today filter: ${todayFormatted} to ${tomorrowFormatted}`);

        dateFilter = and(
          gte(quotations.quotationDate, todayFormatted),
          lte(quotations.quotationDate, tomorrowFormatted)
        );
        break;

      case DateFilterType.THIS_WEEK:
        // Get the start of the current week (Sunday)
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Get the end of the current week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // Format as YYYY-MM-DD for date column
        const startOfWeekFormatted = startOfWeek.toISOString().split("T")[0];
        const endOfWeekFormatted = endOfWeek.toISOString().split("T")[0];

        logger.info(
          `Week filter: ${startOfWeekFormatted} to ${endOfWeekFormatted}`
        );

        dateFilter = and(
          gte(quotations.quotationDate, startOfWeekFormatted),
          lte(quotations.quotationDate, endOfWeekFormatted)
        );
        break;

      case DateFilterType.THIS_MONTH:
        const startOfMonth = new Date();
        startOfMonth.setDate(1); // First day of the current month
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        // Set to last day of the month
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        // Format as YYYY-MM-DD for date column
        const startOfMonthFormatted = startOfMonth.toISOString().split("T")[0];
        const endOfMonthFormatted = endOfMonth.toISOString().split("T")[0];

        logger.info(
          `Month filter: ${startOfMonthFormatted} to ${endOfMonthFormatted}`
        );

        dateFilter = and(
          gte(quotations.quotationDate, startOfMonthFormatted),
          lte(quotations.quotationDate, endOfMonthFormatted)
        );
        break;

      case DateFilterType.CUSTOM:
        if (!filterOptions.startDate || !filterOptions.endDate) {
          throw new Error(
            "Start date and end date are required for custom filter"
          );
        }
        const startDate = new Date(filterOptions.startDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(filterOptions.endDate);
        endDate.setHours(23, 59, 59, 999);

        // Format as YYYY-MM-DD for date column
        const startDateFormatted = startDate.toISOString().split("T")[0];
        const endDateFormatted = endDate.toISOString().split("T")[0];

        logger.info(
          `Custom filter: ${startDateFormatted} to ${endDateFormatted}`
        );

        dateFilter = and(
          gte(quotations.quotationDate, startDateFormatted),
          lte(quotations.quotationDate, endDateFormatted)
        );
        break;

      default:
        throw new Error("Invalid filter type");
    }

    try {
      // Fetch quotations data
      const data = await db
        .select({
          id: quotations.id,
          quotationNumber: quotations.quotationNumber,
          quotationDate: quotations.quotationDate,
          customerName: akuns.name,
          storeName: store.name,
          grandTotal: quotations.grandTotal,
          status: quotations.status,
        })
        .from(quotations)
        .leftJoin(akuns, eq(quotations.customerId, akuns.id))
        .leftJoin(store, eq(quotations.storeId, store.id))
        .where(and(isNull(quotations.deletedAt), dateFilter))
        .orderBy(quotations.quotationDate);

      logger.info(`Retrieved ${data.length} quotations`);

      // Calculate total amount
      const [totalResult] = await db
        .select({
          total: sql<number>`sum(${quotations.grandTotal})`,
        })
        .from(quotations)
        .where(and(isNull(quotations.deletedAt), dateFilter));

      return {
        data,
        total: totalResult.total || 0,
      };
    } catch (error) {
      logger.error("Error fetching quotations report:", error);
      throw error;
    }
  }

  async getPurchasesReport(filterOptions: {
    filterType: DateFilterType;
    startDate?: Date;
    endDate?: Date;
  }) {
    let dateFilter;
    logger.info(
      `Generating purchases report with filter: ${filterOptions.filterType}`
    );

    switch (filterOptions.filterType) {
      case DateFilterType.TODAY:
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        logger.info(
          `Today filter: ${today.toISOString()} to ${tomorrow.toISOString()}`
        );

        dateFilter = and(
          gte(purchases.purchaseDate, today),
          lte(purchases.purchaseDate, tomorrow)
        );
        break;

      case DateFilterType.THIS_WEEK:
        // Get the start of the current week (Sunday)
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Get the end of the current week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        logger.info(
          `Week filter: ${startOfWeek.toISOString()} to ${endOfWeek.toISOString()}`
        );

        dateFilter = and(
          gte(purchases.purchaseDate, startOfWeek),
          lte(purchases.purchaseDate, endOfWeek)
        );
        break;

      case DateFilterType.THIS_MONTH:
        const startOfMonth = new Date();
        startOfMonth.setDate(1); // First day of the current month
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        // Set to last day of the month
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        logger.info(
          `Month filter: ${startOfMonth.toISOString()} to ${endOfMonth.toISOString()}`
        );

        dateFilter = and(
          gte(purchases.purchaseDate, startOfMonth),
          lte(purchases.purchaseDate, endOfMonth)
        );
        break;

      case DateFilterType.CUSTOM:
        if (!filterOptions.startDate || !filterOptions.endDate) {
          throw new Error(
            "Start date and end date are required for custom filter"
          );
        }
        const startDate = new Date(filterOptions.startDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(filterOptions.endDate);
        endDate.setHours(23, 59, 59, 999);

        logger.info(
          `Custom filter: ${startDate.toISOString()} to ${endDate.toISOString()}`
        );

        dateFilter = and(
          gte(purchases.purchaseDate, startDate),
          lte(purchases.purchaseDate, endDate)
        );
        break;

      default:
        throw new Error("Invalid filter type");
    }

    try {
      // Fetch purchases data
      const data = await db
        .select({
          id: purchases.id,
          invoiceNumber: purchases.invoiceNumber,
          purchaseDate: purchases.purchaseDate,
          supplierName: akuns.name,
          storeName: store.name,
          grandTotal: purchases.grandTotal,
          status: purchases.status,
        })
        .from(purchases)
        .leftJoin(akuns, eq(purchases.supplierId, akuns.id))
        .leftJoin(store, eq(purchases.storeId, store.id))
        .where(and(isNull(purchases.deletedAt), dateFilter))
        .orderBy(purchases.purchaseDate);

      logger.info(`Retrieved ${data.length} purchases`);

      // Calculate total amount
      const [totalResult] = await db
        .select({
          total: sql<number>`sum(${purchases.grandTotal})`,
        })
        .from(purchases)
        .where(and(isNull(purchases.deletedAt), dateFilter));

      return {
        data,
        total: totalResult.total || 0,
      };
    } catch (error) {
      logger.error("Error fetching purchases report:", error);
      throw error;
    }
  }

  async getCombinedReport(filterOptions: {
    filterType: DateFilterType;
    startDate?: Date;
    endDate?: Date;
  }) {
    try {
      const quotationsReport = await this.getQuotationsReport(filterOptions);
      const purchasesReport = await this.getPurchasesReport(filterOptions);

      // Calculate difference between quotations and purchases
      const difference =
        Number(quotationsReport.total) - Number(purchasesReport.total);

      return {
        quotations: quotationsReport,
        purchases: purchasesReport,
        difference,
      };
    } catch (error) {
      logger.error("Error fetching combined report:", error);
      throw error;
    }
  }
}
