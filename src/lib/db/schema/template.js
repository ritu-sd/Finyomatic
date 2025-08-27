import {
  pgTable,
  text,
  integer,
  numeric,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { invoices } from "./invoice.js";

export const templates = pgTable("templates", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  invoice_id: text("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
