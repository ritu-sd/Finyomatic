require("dotenv").config();
const { defineConfig } = require("drizzle-kit");

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
