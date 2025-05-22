import { db } from "../config/db";
import { quotations, quotationStatus } from "../models/quotation";
import { quotationDetails } from "../models/quotationDetail";
import { products } from "../models/products";
import { stockMovements } from "../models/stockMovements";
import { akuns } from "../models/akun";
import { store } from "../models/store";
import { faker } from "@faker-js/faker";
import { eq, sql } from "drizzle-orm";

// Define types for our data structures
interface QuotationDetail {
  productId: number;
  quantity: number;
  unitPrice: number;
  discount: string;
  subtotal: string;
  description?: string | null;
  notes?: string | null;
}

async function seedQuotations(
  monthlyHistoricalCount = 10,
  currentMonthCount = 5
) {
  console.log("Starting quotation seeder...");

  // Retrieve all customers
  const allCustomers = await db
    .select()
    .from(akuns)
    .where(eq(akuns.type, "customer"));

  if (allCustomers.length === 0) {
    throw new Error(
      "No customers found. Please seed akuns first with customer type."
    );
  }

  // Retrieve all stores
  const allStores = await db.select().from(store);
  if (allStores.length === 0) {
    throw new Error("No stores found. Please seed stores first.");
  }

  // Retrieve all products
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
    `Seeding ${monthlyHistoricalCount} quotations per month for the past year...`
  );
  console.log(
    `Seeding ${currentMonthCount} quotations for the current month...`
  );

  // Seed historical data (all with accepted, rejected, or expired status)
  for (let month = 0; month < 12; month++) {
    const date = new Date(oneYearAgo);
    date.setMonth(oneYearAgo.getMonth() + month);

    console.log(
      `Creating quotations for ${date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      })}...`
    );

    // Generate quotations for this month
    for (let i = 0; i < monthlyHistoricalCount; i++) {
      // Create quotation date within the specified month
      const quotationDate = new Date(date);
      quotationDate.setDate(faker.number.int({ min: 1, max: 28 }));

      // Choose random status for historical data
      const status = faker.helpers.arrayElement([
        "accepted",
        "rejected",
        "expired",
        "converted",
      ]);

      // Randomly decide if this quotation is for a customer or a store
      const isForStore = faker.datatype.boolean();

      if (isForStore) {
        // Create store quotation (no customer)
        await createQuotation(
          quotationDate,
          null,
          faker.helpers.arrayElement(allStores),
          allProducts,
          status
        );
      } else {
        // Create customer quotation (no store)
        await createQuotation(
          quotationDate,
          faker.helpers.arrayElement(allCustomers),
          null,
          allProducts,
          status
        );
      }
    }
  }

  // Seed current month data (with draft and sent status included)
  console.log(`Creating quotations for the current month...`);
  for (let i = 0; i < currentMonthCount; i++) {
    // Create quotation date within the current month
    const quotationDate = new Date(today);
    quotationDate.setDate(faker.number.int({ min: 1, max: today.getDate() }));

    // Choose random status for current month
    const status = faker.helpers.arrayElement([
      "draft",
      "sent",
      "accepted",
      "rejected",
    ]);

    // Randomly decide if this quotation is for a customer or a store
    const isForStore = faker.datatype.boolean();

    if (isForStore) {
      // Create store quotation (no customer)
      await createQuotation(
        quotationDate,
        null,
        faker.helpers.arrayElement(allStores),
        allProducts,
        status
      );
    } else {
      // Create customer quotation (no store)
      await createQuotation(
        quotationDate,
        faker.helpers.arrayElement(allCustomers),
        null,
        allProducts,
        status
      );
    }
  }

  console.log("✅ Quotation seeding completed successfully");
}

async function createQuotation(
  quotationDate: Date,
  customer: any | null,
  storeItem: any | null,
  productsList: any[],
  status: string
) {
  // Generate quotation number
  const year = quotationDate.getFullYear().toString().slice(-2);
  const month = (quotationDate.getMonth() + 1).toString().padStart(2, "0");
  const day = quotationDate.getDate().toString().padStart(2, "0");
  const random = faker.number.int({ min: 1000, max: 9999 });
  const quotationNumber = `QT-${year}${month}${day}-${random}`;

  // Generate 1-5 random products for this quotation
  const detailsCount = faker.number.int({ min: 1, max: 5 });
  const selectedProducts = faker.helpers.arrayElements(
    productsList,
    detailsCount
  );

  // Calculate totals
  let subtotalAmount = 0;
  const details: QuotationDetail[] = [];

  for (const product of selectedProducts) {
    const quantity = faker.number.int({ min: 1, max: 10 });
    const unitPrice = parseFloat(product.price_sell); // Use selling price for quotations
    const discount = faker.number.int({ min: 0, max: 10 }); // 0-10% discount

    const detailSubtotal = quantity * unitPrice * (1 - discount / 100);
    subtotalAmount += detailSubtotal;

    details.push({
      productId: product.id,
      quantity,
      unitPrice,
      discount: discount.toString(), // Convert to string for Drizzle
      subtotal: detailSubtotal.toString(), // Convert to string for Drizzle
      description: faker.helpers.maybe(
        () => faker.commerce.productDescription(),
        {
          probability: 0.5,
        }
      ),
      notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
        probability: 0.3,
      }),
    });
  }

  // Apply occasional discount to entire quotation
  const discountAmount =
    faker.helpers.maybe(
      () =>
        parseFloat(
          (
            subtotalAmount * faker.number.float({ min: 0.01, max: 0.05 })
          ).toFixed(2)
        ),
      { probability: 0.2 }
    ) || 0;

  const grandTotal = subtotalAmount - discountAmount;

  // Use raw SQL for insertion to avoid TypeScript issues with the Drizzle ORM
  try {
    await db.transaction(async (tx) => {
      // Insert quotation
      const insertQuotationQuery = `
        INSERT INTO quotations (
          quotation_number, quotation_date, customer_id, store_id, 
          subtotal, discount_amount, grand_total, status, 
          notes, created_at, updated_at
        ) VALUES (
          '${quotationNumber}', '${quotationDate.toISOString().split("T")[0]}', 
          ${customer ? customer.id : "NULL"}, 
          ${storeItem ? storeItem.id : "NULL"},
          '${subtotalAmount}', '${discountAmount}', '${grandTotal}', '${status}',
          ${
            faker.helpers.maybe(
              () => `'${faker.lorem.paragraph().replace(/'/g, "''")}'`,
              { probability: 0.3 }
            ) || "NULL"
          },
          '${quotationDate.toISOString()}', '${quotationDate.toISOString()}'
        ) RETURNING id
      `;

      const result = await tx.execute(sql.raw(insertQuotationQuery));
      const quotationId = result[0].id;

      // Insert details and handle stock if status is accepted
      for (const detail of details) {
        // Insert quotation detail
        const insertDetailQuery = `
          INSERT INTO quotation_details (
            quotation_id, product_id, quantity, unit_price, 
            discount, subtotal, description, notes
          ) VALUES (
            ${quotationId}, ${detail.productId}, ${detail.quantity}, '${
          detail.unitPrice
        }',
            '${detail.discount}', '${detail.subtotal}',
            ${
              detail.description
                ? `'${detail.description.replace(/'/g, "''")}'`
                : "NULL"
            },
            ${detail.notes ? `'${detail.notes.replace(/'/g, "''")}'` : "NULL"}
          )
        `;

        await tx.execute(sql.raw(insertDetailQuery));

        // Handle stock movements for accepted quotations that will be fulfilled
        if (status === "accepted" && faker.datatype.boolean(0.7)) {
          // 70% chance of fulfillment
          // Create stock movement - use either akun_id or store_id based on which was provided
          const insertMovementQuery = `
            INSERT INTO stock_movements (
              product_id, movement_type, quantity, note,
              akun_id, store_id, created_at, updated_at
            ) VALUES (
              ${detail.productId}, 'out', ${
            detail.quantity
          }, 'Quotation accepted: ${quotationNumber}',
              ${customer ? customer.id : "NULL"}, 
              ${storeItem ? storeItem.id : "NULL"}, 
              '${quotationDate.toISOString()}', '${quotationDate.toISOString()}'
            )
          `;

          await tx.execute(sql.raw(insertMovementQuery));

          // Update product stock - reduce stock for accepted quotations
          const updateStockQuery = `
            UPDATE products 
            SET stock = stock - ${detail.quantity}, 
                updated_at = '${quotationDate.toISOString()}'
            WHERE id = ${detail.productId}
          `;

          await tx.execute(sql.raw(updateStockQuery));
        }
      }
    });

    return true;
  } catch (error) {
    console.error(`Error creating quotation ${quotationNumber}:`, error);
    throw error;
  }
}

// You can change the number of quotations to generate here
seedQuotations(80, 40)
  .then(() => {
    console.log("Quotation seeding completed");
    process.exit();
  })
  .catch((error) => {
    console.error("Error seeding quotations:", error);
    process.exit(1);
  });
