import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const store = pgTable("store", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  manager: varchar("manager", { length: 100 }),
  contactInfo: text("contact_info"),
  phone: varchar("phone", { length: 15 }),
  email: varchar("email", { length: 100 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});