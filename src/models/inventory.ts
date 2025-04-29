import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { products } from "./products";
import { suppliers } from "./suppliers";
import { departments } from "./departments";

export const movementType = pgEnum("movement_type", ["in", "out"]);
export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "restrict" })
    .notNull(),
  movementType: movementType("movement_type").notNull(),
  quantity: integer("quantity").notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id, {
    onDelete: "restrict",
  }),
  departmentId: integer("department_id").references(() => departments.id, {
    onDelete: "restrict",
  }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
