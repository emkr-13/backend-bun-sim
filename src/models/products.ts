import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  sku: varchar("sku", { length: 50 }).notNull(),
  stock: integer("stock").notNull(),
  categoryId: integer("category_id")
    .references(() => categories.id, { onDelete: "restrict" })
    .notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
