const { text, pgTable, varchar, timestamp } = require("drizzle-orm/pg-core");

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  image: varchar({ length: 255 }),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});
