import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const organizations = pgTable("organizations", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", 200).notNull(),
  email: varchar("email", 200),
  phone: varchar("phone", 40),
  // tax number
  gstin: varchar("gstin", 20),
  pan: varchar("pan", 20),
  country: varchar("country", 2).notNull(),
  state: varchar("state", 64),
  city: varchar("city", 128),
  postal_code: varchar("postal_code", 16),
  address_line1: varchar("address_line1", 200),
  address_line2: varchar("address_line2", 200),
  currency: varchar("currency", 3).notNull().default("INR"),
  logo_url: varchar("logo_url", 400),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
