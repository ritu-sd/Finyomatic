export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  displayName: varchar("display_name", 200).notNull(),
  email: varchar("email", 200),
  phone: varchar("phone", 40),
  gstin: varchar("gstin", 20),
  billingAddress: jsonb("billing_address_json"),
  shippingAddress: jsonb("shipping_address_json"),
});
