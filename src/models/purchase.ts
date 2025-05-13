import {
  pgTable,
  serial,
  integer,
  decimal,
  timestamp,
  varchar,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";
import { akuns } from "./akun";
import { store } from "./store";

export const purchaseStatus = pgEnum("purchase_status", [
  "draft",
  "ordered",
  "received",
  "cancelled",
  "paid",
]);

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull().unique(),
  purchaseDate: timestamp("purchase_date").notNull(),
  supplierId: integer("supplier_id")
    .references(() => akuns.id, { onDelete: "restrict" })
    .notNull(),
  storeId: integer("store_id")
    .references(() => store.id, { onDelete: "restrict" })
    .notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0"),
  discountAmount: decimal("discount_amount", {
    precision: 12,
    scale: 2,
  }).default("0"),
  grandTotal: decimal("grand_total", { precision: 12, scale: 2 }).notNull(),
  status: purchaseStatus("status").notNull().default("draft"),
  notes: text("notes"),
  paymentDueDate: timestamp("payment_due_date"),
  paymentTerm: varchar("payment_term", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
