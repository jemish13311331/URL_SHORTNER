import { Pool } from "pg";

//pool object to run PostgreSQL query
const pool: any = new Pool({
  user: process.env.USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: parseInt(process.env.DB_PORT || "8080"),
});

export default pool;
