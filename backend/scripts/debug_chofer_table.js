require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_DATABASE || 'ExpresoFv',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
});

(async () => {
  try {
    const users = await pool.query('SELECT id, email, nombre, apellido, rol_id, activo FROM usuario WHERE email IN ($1, $2)', ['admin@test.com', 'chofer@test.com']);
    console.log('usuarios', users.rows);
    const choferes = await pool.query('SELECT id, nombre, apellido, telefono, email FROM chofer ORDER BY id');
    console.log('choferes', choferes.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
})();
