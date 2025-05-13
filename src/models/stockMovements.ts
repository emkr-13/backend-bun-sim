import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { products } from "./products";
import { akuns } from "./akun";
import { store } from "./store";

export const movementType = pgEnum("movement_type", ["in", "out"]);
export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "restrict" })
    .notNull(),
  movementType: movementType("movement_type").notNull(),
  quantity: integer("quantity").notNull(),
  note: varchar("note", { length: 255 }),
  akunId: integer("akun_id").references(() => akuns.id, {
    onDelete: "restrict",
  }),
  storeId: integer("store_id").references(() => store.id, {
    onDelete: "restrict",
  }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
