import {
  pgTable,
  text,
  integer,
  numeric,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const items = pgTable("items", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  item_description: text("item_description").notNull(),
  hsnSac: varchar("hsn_sac", 16),
  quantity: integer("quantity").notNull(),
  unit: varchar("unit", 16),
  rate: numeric("rate", { precision: 18, scale: 2 }).default("0"),
  discount: numeric("discount", { precision: 18, scale: 2 }).default("0"),
  tax_rate: numeric("tax_rate", { precision: 18, scale: 2 }).default("0"),
  tax_amount: numeric("tax_amount", { precision: 18, scale: 2 }).default("0"),
  total: numeric("total", { precision: 18, scale: 2 }).default("0"),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
