import { quotationStatus } from "../models/quotation";
import quotationRepository from "../repositories/quotationRepository";

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

  async getAllQuotations() {
    return await quotationRepository.findAll();
  }

  async getQuotationById(id: number) {
    return await quotationRepository.findById(id);
  }

  async updateQuotationStatus(
    id: number,
    status: (typeof quotationStatus.enumValues)[number]
  ) {
    return await quotationRepository.updateStatus(id, status);
  }
}

export default new QuotationService();
