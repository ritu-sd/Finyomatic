import { text, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }), // Added for credentials provider
  image: varchar({ length: 255 }),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});
