require("dotenv").config();
const { drizzle } = require("drizzle-orm/node-postgres");

export const db = drizzle(process.env.DATABASE_URL);
