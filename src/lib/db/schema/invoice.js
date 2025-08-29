import {
  pgTable,
  pgEnum,
  text,
  primaryKey,
  timestamp,
  decimal,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { clients } from "./clients.js";
import { organizations } from "./organizations.js";

// Define enums separately
export const taxTypeEnum = pgEnum("tax_type", ["tax", "gst"]);
export const gstTypeEnum = pgEnum("gst_type", ["cgst_sgst", "igst"]);
export const statusEnum = pgEnum("status", [
  "draft",
  "sent",
  "paid",
  "cancelled",
]);

export const invoices = pgTable("invoice", {
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  invoice_title: text("invoice_title").default("Invoice"),
  invoice_no: text("invoice_no").notNull(),
  invoice_no_label: text("invoice_no_label").default("Invoice No."),
  invoice_date: timestamp("invoice_date").notNull(),
  invoice_date_label: text("invoice_date_label").default("Invoice Date"),
  custom_fields: jsonb("custom_fields").default([]),

  logo: text("logo"),

  client_id: text("client_id").references(() => clients.id, {
    onDelete: "set null",
  }),

  type: text("type").default("invoice"),
  discount: decimal("discount", { precision: 15, scale: 2 }).default("0.00"),
  discount_type: text("discount_type").default("percentage"),
  discount_hidden: boolean("discount_hidden").default(false),
  subtotal: decimal("subtotal", { precision: 15, scale: 2 }).notNull(),
  discount_amount: decimal("discount_amount", {
    precision: 15,
    scale: 2,
  }).notNull(),
  total: decimal("total", { precision: 15, scale: 2 }).notNull(),

  currency: text("currency").default("INR"),
  tax_type: taxTypeEnum("tax_type"), // 'tax' or 'gst'
  gst_type: gstTypeEnum("gst_type"), // 'cgst_sgst' or 'igst'
  // template table reference
  selected_template: text("selected_template").default("classic_template"), //
  //enum: draft, sent, paid, cancelled
  status: statusEnum("status"),
  // organization
  organizations_id: text("organizations_id").references(
    () => organizations.id,
    { onDelete: "set null" }
  ),
  // customer

  clients_id: text("clients_id").references(() => clients.id, {
    onDelete: "set null",
  }),

  notes: text("notes"),
  due_date: timestamp("due_date"),

  // Metadata
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  sent_at: timestamp("sent_at"), // When invoice was sent to client
  paid_at: timestamp("paid_at"), // When invoice was marked as paid
  // email sent at
  // reminders sent at
});
