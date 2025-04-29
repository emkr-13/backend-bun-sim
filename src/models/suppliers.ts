import { not } from "drizzle-orm";
import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  contactInfo: text("contact_info"),
  phone: varchar("phone", { length: 15 }),
  email: varchar("email", { length: 100 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
