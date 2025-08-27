import {
  pgTable,
  text,
  integer,
  numeric,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { invoices } from "./invoice.js";

export const items = pgTable("items", {
  invoice_id: text("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  item_description: text("item_description").notNull(),
  hsn_sac: varchar("hsn_sac", 16),
  quantity: integer("quantity").notNull(),
  unit: varchar("unit", 16),
  rate: numeric("rate", { precision: 18, scale: 2 }).default("0"),
  discount_type: varchar("discount_type", 16).default("percentage"),
  discount: numeric("discount", { precision: 18, scale: 2 }).default("0"),
  tax_type: varchar("tax_type", 16).default("gst"), //gst/cgst/sgst/igst/cess/vat/none
  tax_rate: numeric("tax_rate", { precision: 18, scale: 2 }).default("0"),
  tax_amount: numeric("tax_amount", { precision: 18, scale: 2 }).default("0"),
  total: numeric("total", { precision: 18, scale: 2 }).default("0"),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
