import {
  pgTable,
  serial,
  integer,
  decimal,
  text,
} from "drizzle-orm/pg-core";
import { quotations } from "./quotation";
import { products } from "./products";

export const quotationDetails = pgTable("quotation_details", {
  id: serial("id").primaryKey(),
  quotationId: integer("quotation_id")
    .references(() => quotations.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "restrict" })
    .notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  notes: text("notes"),
});