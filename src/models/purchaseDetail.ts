import {
  pgTable,
  serial,
  integer,
  decimal,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { purchases } from "./purchase";
import { products } from "./products";

export const purchaseDetails = pgTable("purchase_details", {
  id: serial("id").primaryKey(),
  purchaseId: integer("purchase_id")
    .references(() => purchases.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "restrict" })
    .notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  batchNumber: varchar("batch_number", { length: 50 }),
  expiryDate: timestamp("expiry_date"),
  notes: text("notes"),
});
