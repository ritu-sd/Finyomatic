import {
  pgTable,
  text,
  primaryKey,
  timestamp,
  bytea,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const bank = pgTable(
  "bank",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    bankName: text("bank_name").notNull(),
    accountName: text("account_name").notNull(),
    accountNumber: text("account_number").notNull(),
    ifscCode: text("ifsc_code").notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (bank) => [
    {
      compoundKey: primaryKey({
        columns: [bank.id],
      }),
    },
  ]
);
