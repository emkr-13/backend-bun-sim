import { db } from "../config/db";
import { purchases, purchaseStatus } from "../models/purchase";
import { purchaseDetails } from "../models/purchaseDetail";
import { products } from "../models/products";
import { stockMovements } from "../models/stockMovements";
import { akuns } from "../models/akun";
import { faker } from "@faker-js/faker";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";

// Define types for our data structures
interface PurchaseDetail {
  productId: number;
  quantity: number;
  unitPrice: number;
  discount: string;
  subtotal: string;
  notes?: string | null;
}

async function seedPurchases(
  monthlyHistoricalCount = 10,
  currentMonthCount = 5
) {
  console.log("Starting purchase seeder...");

  // Retrieve all suppliers and products
  const allSuppliers = await db
    .select()
    .from(akuns)
    .where(eq(akuns.type, "supplier"));

  if (allSuppliers.length === 0) {
    throw new Error(
      "No suppliers found. Please seed akuns first with supplier type."
    );
  }

  const allProducts = await db.select().from(products);
  if (allProducts.length === 0) {
    throw new Error("No products found. Please seed products first.");
  }

  // Calculate date range (1 year back plus current month)
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  oneYearAgo.setDate(1); // Start from the 1st of month

  console.log(
    `Seeding ${monthlyHistoricalCount} purchases per month for the past year...`
  );
  console.log(
    `Seeding ${currentMonthCount} purchases for the current month...`
  );

  // Seed historical data (all with received or cancelled status)
  for (let month = 0; month < 12; month++) {
    const date = new Date(oneYearAgo);
    date.setMonth(oneYearAgo.getMonth() + month);

    console.log(
      `Creating purchases for ${date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      })}...`
    );

    // Generate purchases for this month
    for (let i = 0; i < monthlyHistoricalCount; i++) {
      // Create purchase date within the specified month
      const purchaseDate = new Date(date);
      purchaseDate.setDate(faker.number.int({ min: 1, max: 28 }));

      // Choose random status (either received or cancelled for historical data)
      const status = faker.helpers.arrayElement(["received", "cancelled"]);

      await createPurchase(purchaseDate, allSuppliers, allProducts, status);
    }
  }

  // Seed current month data (with draft status included)
  console.log(`Creating purchases for the current month...`);
  for (let i = 0; i < currentMonthCount; i++) {
    // Create purchase date within the current month
    const purchaseDate = new Date(today);
    purchaseDate.setDate(faker.number.int({ min: 1, max: today.getDate() }));

    // Choose random status (including draft for current month)
    const status = faker.helpers.arrayElement([
      "draft",
      "received",
      "cancelled",
    ]);

    await createPurchase(purchaseDate, allSuppliers, allProducts, status);
  }

  console.log("✅ Purchase seeding completed successfully");
}

async function createPurchase(
  purchaseDate: Date,
  suppliers: any[],
  productsList: any[],
  status: string
) {
  // Generate random data
  const supplier = faker.helpers.arrayElement(suppliers);

  // Generate invoice number
  const year = purchaseDate.getFullYear().toString().slice(-2);
  const month = (purchaseDate.getMonth() + 1).toString().padStart(2, "0");
  const day = purchaseDate.getDate().toString().padStart(2, "0");
  const random = faker.number.int({ min: 1000, max: 9999 });
  const invoiceNumber = `PO-${year}${month}${day}-${random}`;

  // Generate payment terms
  const paymentTerm = faker.helpers.arrayElement([
    "Net 15",
    "Net 30",
    "Net 45",
    "Net 60",
    null,
  ]);

  let paymentDueDate = null;
  if (paymentTerm && paymentTerm !== null) {
    paymentDueDate = new Date(purchaseDate);
    const days = parseInt(paymentTerm.replace("Net ", ""));
    paymentDueDate.setDate(paymentDueDate.getDate() + days);
  }

  // Generate 1-10 random products for this purchase
  const detailsCount = faker.number.int({ min: 1, max: 10 });
  const selectedProducts = faker.helpers.arrayElements(
    productsList,
    detailsCount
  );

  // Calculate totals
  let totalAmount = 0;
  const details: PurchaseDetail[] = [];

  for (const product of selectedProducts) {
    const quantity = faker.number.int({ min: 10, max: 20 });
    const unitPrice = parseFloat(product.price_cost);
    const discount = faker.number.int({ min: 0, max: 15 }); // 0-15% discount

    const subtotal = quantity * unitPrice * (1 - discount / 100);
    totalAmount += subtotal;

    details.push({
      productId: product.id,
      quantity,
      unitPrice,
      discount: discount.toString(), // Convert to string for Drizzle
      subtotal: subtotal.toString(), // Convert to string for Drizzle
      notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
        probability: 0.3,
      }),
    });
  }

  // Apply occasional discount to entire purchase
  const discountAmount =
    faker.helpers.maybe(
      () =>
        parseFloat(
          (totalAmount * faker.number.float({ min: 0.01, max: 0.05 })).toFixed(
            2
          )
        ),
      { probability: 0.2 }
    ) || 0;

  const grandTotal = totalAmount - discountAmount;

  // Use raw SQL for insertion to avoid TypeScript issues with the Drizzle ORM
  try {
    await db.transaction(async (tx) => {
      // Insert purchase - keep store_id in the model but set it to null
      const insertPurchaseQuery = `
        INSERT INTO purchases (
          invoice_number, purchase_date, supplier_id, store_id, 
          total_amount, discount_amount, grand_total, status, 
          notes, payment_due_date, payment_term, created_at, updated_at
        ) VALUES (
          '${invoiceNumber}', '${purchaseDate.toISOString()}', ${
        supplier.id
      }, NULL,
          '${totalAmount}', '${discountAmount}', '${grandTotal}', '${status}',
          ${
            faker.helpers.maybe(
              () => `'${faker.lorem.paragraph().replace(/'/g, "''")}'`,
              { probability: 0.3 }
            ) || "NULL"
          },
          ${paymentDueDate ? `'${paymentDueDate.toISOString()}'` : "NULL"},
          ${paymentTerm ? `'${paymentTerm}'` : "NULL"},
          '${purchaseDate.toISOString()}', '${purchaseDate.toISOString()}'
        ) RETURNING id
      `;

      const result = await tx.execute(sql.raw(insertPurchaseQuery));
      const purchaseId = result[0].id;

      // Insert details and handle stock if status is received
      for (const detail of details) {
        // Insert purchase detail
        const insertDetailQuery = `
          INSERT INTO purchase_details (
            purchase_id, product_id, quantity, unit_price, 
            discount, subtotal, notes
          ) VALUES (
            ${purchaseId}, ${detail.productId}, ${detail.quantity}, '${
          detail.unitPrice
        }',
            '${detail.discount}', '${detail.subtotal}',
            ${detail.notes ? `'${detail.notes.replace(/'/g, "''")}'` : "NULL"}
          )
        `;

        await tx.execute(sql.raw(insertDetailQuery));

        // Handle stock movements for received purchases
        if (status === "received") {
          // Create stock movement - use akun_id but set store_id to null
          const insertMovementQuery = `
            INSERT INTO stock_movements (
              product_id, movement_type, quantity, note,
              akun_id, store_id, created_at, updated_at
            ) VALUES (
              ${detail.productId}, 'in', ${
            detail.quantity
          }, 'Purchase received: ${invoiceNumber}',
              ${
                supplier.id
              }, NULL, '${purchaseDate.toISOString()}', '${purchaseDate.toISOString()}'
            )
          `;

          await tx.execute(sql.raw(insertMovementQuery));

          // Update product stock
          const updateStockQuery = `
            UPDATE products 
            SET stock = stock + ${detail.quantity}, 
                updated_at = '${purchaseDate.toISOString()}'
            WHERE id = ${detail.productId}
          `;

          await tx.execute(sql.raw(updateStockQuery));
        }
      }
    });

    return true;
  } catch (error) {
    console.error(`Error creating purchase ${invoiceNumber}:`, error);
    throw error;
  }
}

// You can change the number of purchases to generate here
// seedPurchases(monthlyHistoricalCount, currentMonthCount)
seedPurchases(100, 50)
  .then(() => {
    console.log("Purchase seeding completed");
    process.exit();
  })
  .catch((error) => {
    console.error("Error seeding purchases:", error);
    process.exit(1);
  });
