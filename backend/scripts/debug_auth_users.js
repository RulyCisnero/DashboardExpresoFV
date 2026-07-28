import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_DATABASE || 'ExpresoFv',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
});

async function run() {
  const emails = ['admin@test.com', 'chofer@test.com'];
  const result = await pool.query(
    'SELECT id, email, nombre, apellido, rol_id, activo, password_hash FROM usuario WHERE email = ANY($1)',
    [emails]
  );
  console.log(result.rows);

  for (const row of result.rows) {
    const valid = await bcrypt.compare('password123', row.password_hash);
    console.log(`compare password123 for ${row.email}:`, valid);
  }

  await pool.end();
}

run().catch((err) => {
  console.error(err);
  pool.end();
  process.exit(1);
});
