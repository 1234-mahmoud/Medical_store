// db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

// If DATABASE_URL exists, use it. Otherwise use PGHOST/PGUSER/etc from env.
const pool = connectionString
  ? new Pool({
      connectionString,
      ...( /localhost|127\.0\.0\.1/i.test(connectionString)
        ? {}
        : { ssl: { rejectUnauthorized: false } }),
    })
  : new Pool();

export default pool;