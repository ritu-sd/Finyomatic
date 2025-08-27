import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const clients = pgTable("clients", {
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("display_name", 200).notNull(),
  email: varchar("email", 200),
  phone: varchar("phone", 40),
  // tax number
  tax_number: varchar("tax_number", 20),
  country: text("country"),
  city: text("city"),
  state: text("state"),
  address: text("address"),
  postal_code: text("postal_code"),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
