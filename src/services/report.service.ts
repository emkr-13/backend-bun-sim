import { ReportRepository } from "../repositories/report.repository";
import { DateFilterType } from "../dtos/report.dto";
import PDFDocument from "pdfkit";
import logger from "../utils/logger";

export class ReportService {
  private reportRepository: ReportRepository;

  constructor() {
    this.reportRepository = new ReportRepository();
  }

  async generateQuotationsReport(params: {
    filterType: DateFilterType;
    startDate?: string;
    endDate?: string;
    title?: string;
  }) {
    try {
      const filterOptions = {
        filterType: params.filterType,
        startDate: params.startDate ? new Date(params.startDate) : undefined,
        endDate: params.endDate ? new Date(params.endDate) : undefined,
      };

      const reportData = await this.reportRepository.getQuotationsReport(
        filterOptions
      );

      return {
        data: reportData.data,
        total: reportData.total,
        filterOptions,
      };
    } catch (error) {
      logger.error("Error generating quotations report:", error);
      throw error;
    }
  }

  async generatePurchasesReport(params: {
    filterType: DateFilterType;
    startDate?: string;
    endDate?: string;
    title?: string;
  }) {
    try {
      const filterOptions = {
        filterType: params.filterType,
        startDate: params.startDate ? new Date(params.startDate) : undefined,
        endDate: params.endDate ? new Date(params.endDate) : undefined,
      };

      const reportData = await this.reportRepository.getPurchasesReport(
        filterOptions
      );

      return {
        data: reportData.data,
        total: reportData.total,
        filterOptions,
      };
    } catch (error) {
      logger.error("Error generating purchases report:", error);
      throw error;
    }
  }

  async generateCombinedReport(params: {
    filterType: DateFilterType;
    startDate?: string;
    endDate?: string;
    title?: string;
  }) {
    try {
      const filterOptions = {
        filterType: params.filterType,
        startDate: params.startDate ? new Date(params.startDate) : undefined,
        endDate: params.endDate ? new Date(params.endDate) : undefined,
      };

      const reportData = await this.reportRepository.getCombinedReport(
        filterOptions
      );

      return {
        quotations: reportData.quotations,
        purchases: reportData.purchases,
        difference: reportData.difference,
        filterOptions,
      };
    } catch (error) {
      logger.error("Error generating combined report:", error);
      throw error;
    }
  }

  // Helper method to render quotation table in PDF
  private renderQuotationTable(
    doc: typeof PDFDocument.prototype,
    data: any,
    title: string
  ) {
    const pageWidth = doc.page.width;

    // Add title
    doc.fontSize(18).text(title, { align: "center" });
    doc.moveDown();

    // Add date range
    let dateRange = "Date Range: ";
    switch (data.filterOptions.filterType) {
      case DateFilterType.TODAY:
        dateRange += "Today";
        break;
      case DateFilterType.THIS_WEEK:
        dateRange += "This Week";
        break;
      case DateFilterType.THIS_MONTH:
        dateRange += "This Month";
        break;
      case DateFilterType.CUSTOM:
        const startDate = data.filterOptions.startDate
          ? new Date(data.filterOptions.startDate).toLocaleDateString()
          : "N/A";
        const endDate = data.filterOptions.endDate
          ? new Date(data.filterOptions.endDate).toLocaleDateString()
          : "N/A";
        dateRange += `${startDate} to ${endDate}`;
        break;
    }

    doc.fontSize(10).text(dateRange);
    doc.moveDown();

    // Table headers
    const headers = [
      "No",
      "Quotation Number",
      "Date",
      "Customer/Store",
      "Status",
      "Grand Total",
    ];
    const colWidths = [30, 100, 70, 150, 70, 100];
    let yPos = doc.y;
    let xPos = 50;

    doc.font("Helvetica-Bold");
    headers.forEach((header, i) => {
      doc.text(header, xPos, yPos, { width: colWidths[i], align: "left" });
      xPos += colWidths[i];
    });

    // Line below headers
    doc
      .moveTo(50, doc.y + 10)
      .lineTo(pageWidth - 50, doc.y + 10)
      .stroke();
    doc.moveDown();

    // Table rows
    doc.font("Helvetica");
    data.data.forEach((item: any, index: number) => {
      let rowY = doc.y;
      let colX = 50;

      // Check if we need to add a new page
      if (rowY > doc.page.height - 100) {
        doc.addPage();
        rowY = 50;
        doc.y = rowY;
      }

      doc.text((index + 1).toString(), colX, rowY, {
        width: colWidths[0],
        align: "left",
      });
      colX += colWidths[0];

      doc.text(item.quotationNumber, colX, rowY, {
        width: colWidths[1],
        align: "left",
      });
      colX += colWidths[1];

      const formattedDate = new Date(item.quotationDate).toLocaleDateString();
      doc.text(formattedDate, colX, rowY, {
        width: colWidths[2],
        align: "left",
      });
      colX += colWidths[2];

      const customerStore = item.customerName || item.storeName || "N/A";
      doc.text(customerStore, colX, rowY, {
        width: colWidths[3],
        align: "left",
      });
      colX += colWidths[3];

      doc.text(item.status.toUpperCase(), colX, rowY, {
        width: colWidths[4],
        align: "left",
      });
      colX += colWidths[4];

      doc.text(Number(item.grandTotal).toLocaleString(), colX, rowY, {
        width: colWidths[5],
        align: "right",
      });

      doc.moveDown();
    });

    // Line above total
    doc
      .moveTo(50, doc.y)
      .lineTo(pageWidth - 50, doc.y)
      .stroke();
    doc.moveDown();

    // Total
    doc.font("Helvetica-Bold");
    doc.text("TOTAL", 50, doc.y, { width: pageWidth - 150, align: "right" });
    doc.text(Number(data.total).toLocaleString(), pageWidth - 150, doc.y, {
      width: 100,
      align: "right",
    });

    doc.moveDown(2);
  }

  // Helper method to render purchase table in PDF
  private renderPurchaseTable(
    doc: typeof PDFDocument.prototype,
    data: any,
    title: string
  ) {
    const pageWidth = doc.page.width;

    // Add title
    doc.fontSize(18).text(title, { align: "center" });
    doc.moveDown();

    // Add date range
    let dateRange = "Date Range: ";
    switch (data.filterOptions.filterType) {
      case DateFilterType.TODAY:
        dateRange += "Today";
        break;
      case DateFilterType.THIS_WEEK:
        dateRange += "This Week";
        break;
      case DateFilterType.THIS_MONTH:
        dateRange += "This Month";
        break;
      case DateFilterType.CUSTOM:
        const startDate = data.filterOptions.startDate
          ? new Date(data.filterOptions.startDate).toLocaleDateString()
          : "N/A";
        const endDate = data.filterOptions.endDate
          ? new Date(data.filterOptions.endDate).toLocaleDateString()
          : "N/A";
        dateRange += `${startDate} to ${endDate}`;
        break;
    }

    doc.fontSize(10).text(dateRange);
    doc.moveDown();

    // Table headers
    const headers = [
      "No",
      "Invoice Number",
      "Date",
      "Supplier/Store",
      "Status",
      "Grand Total",
    ];
    const colWidths = [30, 100, 70, 150, 70, 100];
    let yPos = doc.y;
    let xPos = 50;

    doc.font("Helvetica-Bold");
    headers.forEach((header, i) => {
      doc.text(header, xPos, yPos, { width: colWidths[i], align: "left" });
      xPos += colWidths[i];
    });

    // Line below headers
    doc
      .moveTo(50, doc.y + 10)
      .lineTo(pageWidth - 50, doc.y + 10)
      .stroke();
    doc.moveDown();

    // Table rows
    doc.font("Helvetica");
    data.data.forEach((item: any, index: number) => {
      let rowY = doc.y;
      let colX = 50;

      // Check if we need to add a new page
      if (rowY > doc.page.height - 100) {
        doc.addPage();
        rowY = 50;
        doc.y = rowY;
      }

      doc.text((index + 1).toString(), colX, rowY, {
        width: colWidths[0],
        align: "left",
      });
      colX += colWidths[0];

      doc.text(item.invoiceNumber, colX, rowY, {
        width: colWidths[1],
        align: "left",
      });
      colX += colWidths[1];

      const formattedDate = new Date(item.purchaseDate).toLocaleDateString();
      doc.text(formattedDate, colX, rowY, {
        width: colWidths[2],
        align: "left",
      });
      colX += colWidths[2];

      const supplierStore = item.supplierName || item.storeName || "N/A";
      doc.text(supplierStore, colX, rowY, {
        width: colWidths[3],
        align: "left",
      });
      colX += colWidths[3];

      doc.text(item.status.toUpperCase(), colX, rowY, {
        width: colWidths[4],
        align: "left",
      });
      colX += colWidths[4];

      doc.text(Number(item.grandTotal).toLocaleString(), colX, rowY, {
        width: colWidths[5],
        align: "right",
      });

      doc.moveDown();
    });

    // Line above total
    doc
      .moveTo(50, doc.y)
      .lineTo(pageWidth - 50, doc.y)
      .stroke();
    doc.moveDown();

    // Total
    doc.font("Helvetica-Bold");
    doc.text("TOTAL", 50, doc.y, { width: pageWidth - 150, align: "right" });
    doc.text(Number(data.total).toLocaleString(), pageWidth - 150, doc.y, {
      width: 100,
      align: "right",
    });

    doc.moveDown(2);
  }

  // Generate quotation report PDF
  generateQuotationReportPdf(data: any, params: { title?: string }) {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
        autoFirstPage: true,
      });
      const title = params.title || "Quotations Report";

      // Generate quotations section
      this.renderQuotationTable(doc, data, title);

      // Add simple footer to current page
      const footerText = `Generated on ${new Date().toLocaleString()}`;
      const footerY = doc.page.height - 50;

      doc.fontSize(8).text(footerText, 50, footerY, { align: "center" });

      return doc;
    } catch (error) {
      logger.error("Error generating quotation PDF:", error);
      throw error;
    }
  }

  // Generate purchase report PDF
  generatePurchaseReportPdf(data: any, params: { title?: string }) {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
        autoFirstPage: true,
      });
      const title = params.title || "Purchases Report";

      // Generate purchases section
      this.renderPurchaseTable(doc, data, title);

      // Add simple footer to current page
      const footerText = `Generated on ${new Date().toLocaleString()}`;
      const footerY = doc.page.height - 50;

      doc.fontSize(8).text(footerText, 50, footerY, { align: "center" });

      return doc;
    } catch (error) {
      logger.error("Error generating purchase PDF:", error);
      throw error;
    }
  }

  // Generate combined report PDF
  generateCombinedReportPdf(data: any, params: { title?: string }) {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
        autoFirstPage: true,
      });
      const title = params.title || "Combined Financial Report";

      // Add header
      doc.fontSize(20).text(title, { align: "center" });
      doc.moveDown();

      // Add date range
      let dateRange = "Date Range: ";
      switch (data.filterOptions.filterType) {
        case DateFilterType.TODAY:
          dateRange += "Today";
          break;
        case DateFilterType.THIS_WEEK:
          dateRange += "This Week";
          break;
        case DateFilterType.THIS_MONTH:
          dateRange += "This Month";
          break;
        case DateFilterType.CUSTOM:
          const startDate = data.filterOptions.startDate
            ? new Date(data.filterOptions.startDate).toLocaleDateString()
            : "N/A";
          const endDate = data.filterOptions.endDate
            ? new Date(data.filterOptions.endDate).toLocaleDateString()
            : "N/A";
          dateRange += `${startDate} to ${endDate}`;
          break;
      }

      doc.fontSize(10).text(dateRange);
      doc.moveDown();

      // Generate quotations section
      this.renderQuotationTable(
        doc,
        {
          data: data.quotations.data,
          total: data.quotations.total,
          filterOptions: data.filterOptions,
        },
        "Quotations"
      );

      // Add page break
      doc.addPage();

      // Generate purchases section
      this.renderPurchaseTable(
        doc,
        {
          data: data.purchases.data,
          total: data.purchases.total,
          filterOptions: data.filterOptions,
        },
        "Purchases"
      );

      // Add summary section
      doc.moveDown(2);
      doc.fontSize(14).text("Summary", { align: "center" });
      doc.moveDown();

      const pageWidth = doc.page.width;
      doc.font("Helvetica-Bold");

      // Quotations total
      doc.text("Quotations Total:", 50, doc.y, {
        width: pageWidth - 200,
        align: "left",
      });
      doc.text(
        Number(data.quotations.total).toLocaleString(),
        pageWidth - 150,
        doc.y,
        { width: 100, align: "right" }
      );
      doc.moveDown();

      // Purchases total
      doc.text("Purchases Total:", 50, doc.y, {
        width: pageWidth - 200,
        align: "left",
      });
      doc.text(
        Number(data.purchases.total).toLocaleString(),
        pageWidth - 150,
        doc.y,
        { width: 100, align: "right" }
      );
      doc.moveDown();

      // Line above difference
      doc
        .moveTo(pageWidth - 250, doc.y)
        .lineTo(pageWidth - 50, doc.y)
        .stroke();
      doc.moveDown();

      // Difference
      doc.text("Difference:", 50, doc.y, {
        width: pageWidth - 200,
        align: "left",
      });
      doc.text(
        Number(data.difference).toLocaleString(),
        pageWidth - 150,
        doc.y,
        {
          width: 100,
          align: "right",
        }
      );

      // Add simple footer to current page
      const footerText = `Generated on ${new Date().toLocaleString()}`;
      const footerY = doc.page.height - 50;

      doc.fontSize(8).text(footerText, 50, footerY, { align: "center" });

      return doc;
    } catch (error) {
      logger.error("Error generating combined PDF:", error);
      throw error;
    }
  }
}
