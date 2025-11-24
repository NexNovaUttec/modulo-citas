import { pool } from "./config/db.js";

const run = async () => {
  try {
    const res = await pool.query("SELECT 1 as ok");
    console.log("DB CONNECT OK:", res.rows[0]);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("DB CONNECT ERROR:", err);
    process.exit(1);
  }
};

run();
