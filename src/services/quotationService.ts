import { quotationStatus } from "../models/quotation";
import quotationRepository from "../repositories/quotationRepository";
import { pagination } from "../utils/helper";

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

    // Additional business rules could be added here
    // For example:
    // - Cannot update status if already converted
    // - Only allow specific status transitions

    return await quotationRepository.updateStatus(id, status);
  }
}

export default new QuotationService();
