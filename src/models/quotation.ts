import {
  pgTable,
  serial,
  integer,
  decimal,
  timestamp,
  varchar,
  text,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { akuns } from "./akun";
import { store } from "./store";

export const quotationStatus = pgEnum("quotation_status", [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
  "converted",
]);

export const quotations = pgTable("quotations", {
  id: serial("id").primaryKey(),
  quotationNumber: varchar("quotation_number", { length: 50 })
    .notNull()
    .unique(),
  quotationDate: date("quotation_date").notNull(),
  customerId: integer("customer_id")
    .references(() => akuns.id, { onDelete: "restrict" }),
  storeId: integer("store_id")
    .references(() => store.id, { onDelete: "restrict" }),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", {
    precision: 12,
    scale: 2,
  }).default("0"),
  grandTotal: decimal("grand_total", { precision: 12, scale: 2 }).notNull(),
  status: quotationStatus("status").notNull().default("draft"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
