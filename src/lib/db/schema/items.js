export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  name: varchar("name", 200).notNull(),
  sku: varchar("sku", 64),
  hsnSac: varchar("hsn_sac", 16),
  uom: varchar("uom", 16),
  defaultPrice: numeric("default_price", { precision: 18, scale: 2 }).default(
    "0"
  ),
  taxInclusive: boolean("tax_inclusive").default(false),
});
