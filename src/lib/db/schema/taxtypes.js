import {
  pgTable,
  text,
  integer,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const taxRates = pgTable("tax_rates", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tax_type: varchar("tax_type", 16).default("gst"), //
  gst_type: varchar("gst_type", 16), // CGST|SGST|IGST|CESS|VAT|NONE
});
