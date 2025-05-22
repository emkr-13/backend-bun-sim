import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { Response } from "express";
import fs from "fs";
import path from "path";

interface ProductData {
  id: number;
  name: string;
  sku: string;
  stock: number;
  satuan: string;
  categoryName: string;
  price_sell: string;
  price_cost: string;
}

// Company information for reports
const companyInfo = {
  name: "Demo Aplikasi",
  address: "Jl. Raya Utama No. 123, Jakarta Selatan",
  phone: "(021) 555-1234",
  email: "info@demoaplikasi.com",
  website: "www.demoaplikasi.com",
};

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

  // Get the logo path
  const logoPath = path.join(
    process.cwd(),
    "public",
    "images",
    "logo_emkr_crop.png"
  );

  // Add logo if it exists
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, doc.page.width - 150, 50, { width: 100 });
  }

  // Add company header
  doc.fontSize(20).font("Helvetica-Bold").text(companyInfo.name, 50, 50);
  doc.fontSize(10).font("Helvetica").text(companyInfo.address, 50, 75);
  doc.text(`Tel: ${companyInfo.phone} | Email: ${companyInfo.email}`, 50, 90);
  doc.text(`Website: ${companyInfo.website}`, 50, 105);

  // Add horizontal line
  doc.moveDown(2);
  doc
    .moveTo(50, 130)
    .lineTo(doc.page.width - 50, 130)
    .stroke();

  // Add report title
  doc.moveDown();
  doc.fontSize(16).font("Helvetica-Bold").text(title, { align: "center" });
  doc.moveDown();

  // Add current date
  const formattedDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Generated on: ${formattedDate}`, { align: "center" });
  doc.moveDown(2);

  // Define table layout
  const tableTop = 200;
  const tableLeft = 50;
  const colWidths = [120, 70, 40, 50, 80, 70, 70]; // Column widths with added satuan column
  const rowHeight = 20;

  // Draw table headers
  const headers = [
    "Product Name",
    "SKU",
    "Stock",
    "Satuan",
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
    doc.text(product.name.toString().substring(0, 20), x + 5, y + 5, {
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

    // Satuan
    doc.text(product.satuan || "-", x + 5, y + 5, {
      width: colWidths[3] - 10,
    });
    x += colWidths[3];

    // Category
    doc.text(product.categoryName.toString(), x + 5, y + 5, {
      width: colWidths[4] - 10,
    });
    x += colWidths[4];

    // Price Sell
    doc.text(formatCurrency(product.price_sell.toString()), x + 5, y + 5, {
      width: colWidths[5] - 10,
    });
    x += colWidths[5];

    // Price Cost
    doc.text(formatCurrency(product.price_cost.toString()), x + 5, y + 5, {
      width: colWidths[6] - 10,
    });

    y += rowHeight;

    // Add a new page if we're near the bottom
    if (y > doc.page.height - 100) {
      doc.addPage();
      y = 50;

      // Add page header on new page
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(`${title} (continued)`, 50, 30);
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Generated on: ${formattedDate}`, 50, 45);

      // Re-draw table headers
      const headerY = 70;
      doc.fontSize(10).font("Helvetica-Bold");

      doc
        .fillColor("#f0f0f0")
        .rect(
          tableLeft,
          headerY,
          colWidths.reduce((a, b) => a + b, 0),
          rowHeight
        )
        .fill();

      doc.fillColor("#000000");
      headers.forEach((header, i) => {
        let x = tableLeft;
        for (let j = 0; j < i; j++) {
          x += colWidths[j];
        }
        doc.text(header, x + 5, headerY + 5);
      });

      y = headerY + rowHeight;
      doc.font("Helvetica");
    }
  });

  // Draw table border
  doc
    .rect(
      tableLeft,
      tableTop,
      colWidths.reduce((a, b) => a + b, 0),
      Math.min(y - tableTop, doc.page.height - 200)
    )
    .stroke();

  // Add footer
  const footerY = doc.page.height - 50;
  doc
    .fontSize(8)
    .font("Helvetica-Bold")
    .text(
      `This is a computer-generated document. No signature is required.`,
      50,
      footerY,
      { align: "center" }
    );

  doc
    .fontSize(8)
    .text(
      `© ${new Date().getFullYear()} ${companyInfo.name}. All rights reserved.`,
      50,
      footerY + 15,
      { align: "center" }
    );

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

  // Company information
  worksheet.getCell("A1").value = companyInfo.name;
  worksheet.getCell("A1").font = { bold: true, size: 16 };
  worksheet.mergeCells("A1:G1");

  worksheet.getCell("A2").value = companyInfo.address;
  worksheet.mergeCells("A2:G2");

  worksheet.getCell(
    "A3"
  ).value = `Tel: ${companyInfo.phone} | Email: ${companyInfo.email} | Website: ${companyInfo.website}`;
  worksheet.mergeCells("A3:G3");

  // Add logo if it exists
  const logoPath = path.join(
    process.cwd(),
    "public",
    "images",
    "logo_emkr_crop.png"
  );
  if (fs.existsSync(logoPath)) {
    const logo = workbook.addImage({
      filename: logoPath,
      extension: "png",
    });

    // Add logo to the top right
    worksheet.addImage(logo, {
      tl: { col: 6, row: 0 },
      ext: { width: 100, height: 50 },
    });
  }

  // Add horizontal line (using border)
  ["A4", "B4", "C4", "D4", "E4", "F4", "G4"].forEach((cell) => {
    worksheet.getCell(cell).border = {
      bottom: { style: "medium" },
    };
  });
  worksheet.mergeCells("A4:G4");

  // Report title
  worksheet.getCell("A5").value = title;
  worksheet.getCell("A5").font = { bold: true, size: 14 };
  worksheet.getCell("A5").alignment = { horizontal: "center" };
  worksheet.mergeCells("A5:G5");

  // Generated date
  const formattedDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  worksheet.getCell("A6").value = `Generated on: ${formattedDate}`;
  worksheet.getCell("A6").font = { italic: true, size: 10 };
  worksheet.getCell("A6").alignment = { horizontal: "center" };
  worksheet.mergeCells("A6:G6");

  // Add empty row for spacing
  worksheet.getRow(7).height = 10;

  // Define columns (starting at row 8)
  worksheet.columns = [
    { header: "Product Name", key: "name", width: 30 },
    { header: "SKU", key: "sku", width: 15 },
    { header: "Stock", key: "stock", width: 10 },
    { header: "Satuan", key: "satuan", width: 10 },
    { header: "Category", key: "categoryName", width: 20 },
    { header: "Price Sell", key: "price_sell", width: 15 },
    { header: "Price Cost", key: "price_cost", width: 15 },
  ];

  // Style the header row (row 8)
  const headerRow = worksheet.getRow(8);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 20;

  // Add data rows (starting from row 9)
  products.forEach((product) => {
    const row = worksheet.addRow({
      name: product.name,
      sku: product.sku,
      stock: product.stock,
      satuan: product.satuan || "-",
      categoryName: product.categoryName,
      price_sell: product.price_sell,
      price_cost: product.price_cost,
    });

    // Format currency cells
    const sellPriceCell = row.getCell("price_sell");
    const costPriceCell = row.getCell("price_cost");

    sellPriceCell.numFmt = "#,##0.00";
    costPriceCell.numFmt = "#,##0.00";
  });

  // Apply borders and styling to all data cells
  for (let i = 8; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);

    // Apply borders to all cells
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Skip header row for alignment
    if (i > 8) {
      // Apply right alignment to specific columns
      const stockCell = row.getCell(3); // Stock column
      const priceSellCell = row.getCell(6); // Price Sell column
      const priceCostCell = row.getCell(7); // Price Cost column

      stockCell.alignment = { horizontal: "right" };
      priceSellCell.alignment = { horizontal: "right" };
      priceCostCell.alignment = { horizontal: "right" };
    }
  }

  // Add footer
  const footerRow = worksheet.getRow(worksheet.rowCount + 2);
  footerRow.getCell(1).value =
    "This is a computer-generated document. No signature is required.";
  worksheet.mergeCells(`A${footerRow.number}:G${footerRow.number}`);
  footerRow.getCell(1).font = { italic: true, size: 8 };
  footerRow.getCell(1).alignment = { horizontal: "center" };

  const copyrightRow = worksheet.getRow(worksheet.rowCount + 1);
  copyrightRow.getCell(1).value = `© ${new Date().getFullYear()} ${
    companyInfo.name
  }. All rights reserved.`;
  worksheet.mergeCells(`A${copyrightRow.number}:G${copyrightRow.number}`);
  copyrightRow.getCell(1).font = { italic: true, size: 8 };
  copyrightRow.getCell(1).alignment = { horizontal: "center" };

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

// Helper function to format currency
function formatCurrency(value: string): string {
  const num = parseFloat(value);
  return num.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
