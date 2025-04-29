import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const akunType = pgEnum("akun_type", ["customer", "supplier"]);

export const akuns = pgTable("akun", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 15 }),
  email: varchar("email", { length: 100 }).unique(),
  address: text("address"),
  type: akunType("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
