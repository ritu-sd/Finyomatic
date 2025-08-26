import {
  pgTable,
  text,
  integer,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const taxRates = pgTable("tax_rates", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  name: varchar("name", 80).notNull(), // e.g., "GST 18%"
  kind: varchar("kind", 16).notNull(), // CGST|SGST|IGST|CESS|VAT|NONE
  rate: numeric("rate", { precision: 6, scale: 3 }).notNull(), // percent
});
