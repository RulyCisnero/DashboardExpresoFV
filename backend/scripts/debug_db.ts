import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_DATABASE || 'ExpresoFv',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
});

async function main() {
  try {
    const usuarioColumns = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'usuario' ORDER BY ordinal_position"
    );
    console.log('usuario columns:', usuarioColumns.rows.map((row) => row.column_name));

    const enchColumns = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'encomienda' ORDER BY ordinal_position"
    );
    console.log('encomienda columns:', enchColumns.rows.map((row) => row.column_name));

    const usuarios = await pool.query(
      `SELECT u.id, u.email, u.nombre, u.apellido, u.rol_id, r.nombre as rol
       FROM usuario u
       LEFT JOIN rol r ON u.rol_id = r.id
       WHERE u.email = $1 OR u.email = $2`,
      ['admin@test.com', 'chofer@test.com']
    );
    console.log('usuarios:', usuarios.rows);

    const choferes = await pool.query(
      'SELECT id, nombre, apellido, email FROM chofer WHERE email = $1 OR email = $2',
      ['admin@test.com', 'chofer@test.com']
    );
    console.log('choferes:', choferes.rows);

    const latestEncomiendas = await pool.query(
      'SELECT id, chofer_id, fecha_entrega, fecha_creacion FROM encomienda ORDER BY id DESC LIMIT 10'
    );
    console.log('encomiendas latest:', latestEncomiendas.rows);

    const specific = await pool.query(
      'SELECT id, chofer_id, fecha_entrega, fecha_creacion FROM encomienda WHERE fecha_entrega::date = $1 ORDER BY id DESC',
      [new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]]
    );
    console.log('encomiendas for tomorrow:', specific.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

main();
