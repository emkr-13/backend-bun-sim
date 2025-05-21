import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { Response } from "express";

interface ProductData {
  id: number;
  name: string;
  sku: string;
  stock: number;
  categoryName: string;
  price_sell: string;
  price_cost: string;
}

/**
 * Export products data to PDF format
 * @param res Express Response object
 * @param products Array of product data
 * @param title Title for the PDF document
 */
export const exportToPdf = (
  res: Response,
  products: ProductData[],
  title: string = "Products Report"
): void => {
  // Create a new PDF document
  const doc = new PDFDocument({ margin: 50 });

  // Set response headers for PDF download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${title.replace(/\s+/g, "_")}.pdf`
  );

  // Pipe the PDF document to the response
  doc.pipe(res);

  // Add title
  doc.fontSize(20).text(title, { align: "center" });
  doc.moveDown();

  // Add current date
  doc
    .fontSize(10)
    .text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" });
  doc.moveDown(2);

  // Define table layout
  const tableTop = 150;
  const tableLeft = 50;
  const colWidths = [150, 70, 50, 100, 70, 70]; // Column widths
  const rowHeight = 20;

  // Draw table headers
  const headers = [
    "Product Name",
    "SKU",
    "Stock",
    "Category",
    "Price Sell",
    "Price Cost",
  ];

  doc.fontSize(10).font("Helvetica-Bold");

  // Draw header background
  doc
    .fillColor("#f0f0f0")
    .rect(
      tableLeft,
      tableTop,
      colWidths.reduce((a, b) => a + b, 0),
      rowHeight
    )
    .fill();

  // Draw header text
  doc.fillColor("#000000");
  headers.forEach((header, i) => {
    let x = tableLeft;
    for (let j = 0; j < i; j++) {
      x += colWidths[j];
    }
    doc.text(header, x + 5, tableTop + 5);
  });

  // Draw table rows
  let y = tableTop + rowHeight;
  doc.font("Helvetica");

  products.forEach((product, index) => {
    // Alternate row background
    if (index % 2 === 0) {
      doc
        .fillColor("#f9f9f9")
        .rect(
          tableLeft,
          y,
          colWidths.reduce((a, b) => a + b, 0),
          rowHeight
        )
        .fill();
    }

    doc.fillColor("#000000");

    // Draw row data
    let x = tableLeft;

    // Product name
    doc.text(product.name.toString().substring(0, 25), x + 5, y + 5, {
      width: colWidths[0] - 10,
    });
    x += colWidths[0];

    // SKU
    doc.text(product.sku.toString(), x + 5, y + 5, {
      width: colWidths[1] - 10,
    });
    x += colWidths[1];

    // Stock
    doc.text(product.stock.toString(), x + 5, y + 5, {
      width: colWidths[2] - 10,
    });
    x += colWidths[2];

    // Category
    doc.text(product.categoryName.toString(), x + 5, y + 5, {
      width: colWidths[3] - 10,
    });
    x += colWidths[3];

    // Price Sell
    doc.text(product.price_sell.toString(), x + 5, y + 5, {
      width: colWidths[4] - 10,
    });
    x += colWidths[4];

    // Price Cost
    doc.text(product.price_cost.toString(), x + 5, y + 5, {
      width: colWidths[5] - 10,
    });

    y += rowHeight;

    // Add a new page if we're near the bottom
    if (y > doc.page.height - 100) {
      doc.addPage();
      y = 50;
    }
  });

  // Draw table border
  doc
    .rect(
      tableLeft,
      tableTop,
      colWidths.reduce((a, b) => a + b, 0),
      Math.min(y - tableTop, doc.page.height - 100)
    )
    .stroke();

  // Finalize the PDF and end the stream
  doc.end();
};

/**
 * Export products data to Excel format
 * @param res Express Response object
 * @param products Array of product data
 * @param title Title for the Excel document
 */
export const exportToExcel = async (
  res: Response,
  products: ProductData[],
  title: string = "Products Report"
): Promise<void> => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Products");

  // Define columns
  worksheet.columns = [
    { header: "Product Name", key: "name", width: 30 },
    { header: "SKU", key: "sku", width: 15 },
    { header: "Stock", key: "stock", width: 10 },
    { header: "Category", key: "categoryName", width: 20 },
    { header: "Price Sell", key: "price_sell", width: 15 },
    { header: "Price Cost", key: "price_cost", width: 15 },
  ];

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };

  // Add rows
  worksheet.addRows(products);

  // Apply borders to all cells
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      if (rowNumber > 1) {
        // Align numbers to right
        if (typeof cell.value === "number") {
          cell.alignment = { horizontal: "right" };
        }
      }
    });
  });

  // Set title in a merged cell at the top
  worksheet.insertRow(1, [title]);
  worksheet.mergeCells("A1:F1");
  const titleRow = worksheet.getRow(1);
  titleRow.height = 30;
  titleRow.font = { bold: true, size: 16 };
  titleRow.alignment = { vertical: "middle", horizontal: "center" };

  // Insert date
  worksheet.insertRow(2, [`Generated on: ${new Date().toLocaleString()}`]);
  worksheet.mergeCells("A2:F2");
  const dateRow = worksheet.getRow(2);
  dateRow.font = { italic: true, size: 10 };
  dateRow.alignment = { horizontal: "right" };

  // Add empty row for spacing
  worksheet.insertRow(3, []);

  // Set response headers for Excel download
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${title.replace(/\s+/g, "_")}.xlsx`
  );

  // Write to response
  await workbook.xlsx.write(res);
};
