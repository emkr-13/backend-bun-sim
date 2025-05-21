import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const satuanType = pgEnum("satuan", ["pcs", "box", "kg"]);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  sku: varchar("sku", { length: 50 }).notNull().unique(),
  stock: integer("stock").notNull().default(0),
  categoryId: integer("category_id")
    .references(() => categories.id, { onDelete: "restrict" })
    .notNull(),
  satuan: satuanType("satuan").notNull().default("pcs"),
  price_sell: decimal("price_sell", { precision: 10, scale: 2 }).notNull(),
  price_cost: decimal("price_cost", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
