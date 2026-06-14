import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
/* const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_DATABASE || "ExpresoFv",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "123456",
});
 */
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD_PROD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});
console.log("Pool de PostgreSQL inicializado");

export default pool;