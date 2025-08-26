import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const customers = pgTable("customers", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("display_name", 200).notNull(),
  email: varchar("email", 200),
  phone: varchar("phone", 40),
  gstin: varchar("gstin", 20),
  country: text("country"),
  city: text("city"),
  state: text("state"),
  address: text("address"),
  postalCode: text("postalCode"),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
