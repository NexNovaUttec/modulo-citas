import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

// Create the pool after loading environment variables so DATABASE_URL is available.
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
