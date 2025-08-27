const {
  pgTable,
  text,
  primaryKey,
  timestamp,
  decimal,
  integer,
  boolean,
  jsonb,
} = require("drizzle-orm/pg-core");
const { users } = require("./user");
const { customers } = require("./customer");

export const invoices = pgTable("invoice", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  invoiceTitle: text("invoiceTitle").default("Invoice"),
  invoiceNo: text("invoiceNo").notNull(),
  invoiceNoLabel: text("invoiceNoLabel").default("Invoice No."),
  invoiceDate: timestamp("invoiceDate").notNull(),
  invoiceDateLabel: text("invoiceDateLabel").default("Invoice Date"),
  customFields: jsonb("customFields").default([]),

  logo: text("logo"),

  customerId: text("customerId").references(() => customers.id, {
    onDelete: "set null",
  }),

  type: text("type").default("invoice"),

  items: jsonb("items").notNull().default([]),

  discount: decimal("discount", { precision: 15, scale: 2 }).default("0.00"),
  discountType: text("discountType").default("percentage"),
  discountHidden: boolean("discountHidden").default(false),
  subtotal: decimal("subtotal", { precision: 15, scale: 2 }).notNull(),
  discountAmount: decimal("discountAmount", {
    precision: 15,
    scale: 2,
  }).notNull(),
  total: decimal("total", { precision: 15, scale: 2 }).notNull(),

  currency: text("currency").default("INR"),
  selectedTaxType: text("selectedTaxType").default("gst"), // 'tax' or 'gst'
  gstType: text("gstType").default("cgst_sgst"), // 'cgst_sgst' or 'igst'
  selectedTemplate: text("selectedTemplate").default("classic_template"), //
  status: text("status").default("draft"),

  notes: text("notes"),
  dueDate: timestamp("dueDate"),

  // Metadata
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  sentAt: timestamp("sentAt"), // When invoice was sent to client
  paidAt: timestamp("paidAt"), // When invoice was marked as paid
});
