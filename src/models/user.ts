import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  fullname: varchar("fullname", { length: 150 }),
  refreshToken: varchar("refresh_token", { length: 255 }),
  refreshTokenExp: timestamp("refresh_token_exp"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
