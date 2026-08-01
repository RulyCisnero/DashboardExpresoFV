import assert from 'node:assert/strict';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const baseUrl = 'http://localhost:5100/api';
const adminCreds = { email: 'admin@test.com', password: 'password123' };
const choferCreds = { email: 'chofer@test.com', password: 'password123' };
const expectedChoferEmail = choferCreds.email;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_DATABASE || 'ExpresoFv',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
});

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => null);
  return { response, body };
}

async function loginUser(credentials) {
  const { response, body } = await fetchJson(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  assert(response.ok, `Login failed for ${credentials.email}: ${JSON.stringify(body)}`);
  assert(body.token, 'Access token missing in login response');

  return { token: body.token, usuario: body.usuario };
}

async function getRoleId(roleName) {
  const result = await pool.query('SELECT id FROM rol WHERE nombre = $1 LIMIT 1', [roleName]);
  return result.rows[0]?.id ?? null;
}

async function ensureRoleExists(roleName) {
  const roleId = await getRoleId(roleName);
  if (roleId) return roleId;
  const insert = await pool.query('INSERT INTO rol (nombre, descripcion) VALUES ($1, $2) RETURNING id', [roleName, `Rol ${roleName}`]);
  return insert.rows[0].id;
}

async function ensureLocalidad() {
  const result = await pool.query('SELECT id FROM localidad LIMIT 1');
  if (result.rows.length > 0) return result.rows[0].id;
  const insert = await pool.query('INSERT INTO localidad (nombre) VALUES ($1) RETURNING id', ['Localidad Test']);
  return insert.rows[0].id;
}

async function ensureCliente(localidadId) {
  const result = await pool.query('SELECT id FROM cliente LIMIT 1');
  if (result.rows.length > 0) return result.rows[0].id;
  const insert = await pool.query(
    'INSERT INTO cliente (nombre, apellido, direccion_local, telefono, email, id_localidad) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    ['Cliente', 'Prueba', 'Direccion Test 1', '299-0000000', 'cliente@test.com', localidadId]
  );
  return insert.rows[0].id;
}

async function ensureChoferExists(email) {
  let result = await pool.query('SELECT id, nombre, apellido FROM chofer WHERE email = $1 LIMIT 1', [email]);
  if (result.rows.length > 0) return result.rows[0];

  const insert = await pool.query(
    'INSERT INTO chofer (nombre, apellido, telefono, email) VALUES ($1, $2, $3, $4) RETURNING id, nombre, apellido',
    ['Chofer', 'Test', '299-1111111', email]
  );
  return insert.rows[0];
}

async function tableHasColumn(table, column) {
  const result = await pool.query(
    'SELECT 1 FROM information_schema.columns WHERE table_name = $1 AND column_name = $2 LIMIT 1',
    [table, column]
  );
  return result.rows.length > 0;
}

async function ensureUsuario(email, password, nombreUsuario, nombre, apellido, roleName, localidadId) {
  const usesLocalidad = await tableHasColumn('usuario', 'localidad_id');
  const result = await pool.query('SELECT u.id FROM usuario u WHERE u.email = $1 LIMIT 1', [email]);
  const rolId = await ensureRoleExists(roleName);
  const passwordHash = await bcrypt.hash(password, 10);

  if (result.rows.length > 0) {
    if (usesLocalidad) {
      await pool.query(
        'UPDATE usuario SET password_hash = $1, nombre_usuario = $2, nombre = $3, apellido = $4, rol_id = $5, localidad_id = $6 WHERE email = $7',
        [passwordHash, nombreUsuario, nombre, apellido, rolId, localidadId, email]
      );
    } else {
      await pool.query(
        'UPDATE usuario SET password_hash = $1, nombre_usuario = $2, nombre = $3, apellido = $4, rol_id = $5 WHERE email = $6',
        [passwordHash, nombreUsuario, nombre, apellido, rolId, email]
      );
    }
    return result.rows[0].id;
  }

  if (usesLocalidad) {
    const insert = await pool.query(
      'INSERT INTO usuario (email, nombre_usuario, nombre, apellido, password_hash, rol_id, localidad_id, activo) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING id',
      [email, nombreUsuario, nombre, apellido, passwordHash, rolId, localidadId]
    );
    return insert.rows[0].id;
  }

  const insert = await pool.query(
    'INSERT INTO usuario (email, nombre_usuario, nombre, apellido, password_hash, rol_id, activo) VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING id',
    [email, nombreUsuario, nombre, apellido, passwordHash, rolId]
  );
  return insert.rows[0].id;
}

async function runTest() {
  console.log('Preparando datos de prueba...');
  const localidadId = await ensureLocalidad();
  const clienteId = await ensureCliente(localidadId);
  const choferRecord = await ensureChoferExists(expectedChoferEmail);
  const adminId = await ensureUsuario(adminCreds.email, adminCreds.password, 'adminuser', 'Admin', 'Test', 'administrador', localidadId);
  const choferUserId = await ensureUsuario(choferCreds.email, choferCreds.password, 'choferuser', 'Chofer', 'Test', 'chofer', localidadId);

  console.log('1) Login admin');
  const admin = await loginUser(adminCreds);

  console.log('2) Obtener chofer por email');
  const { response: choferesResponse, body: choferesBody } = await fetchJson(`${baseUrl}/choferes`, {
    headers: { Authorization: `Bearer ${admin.token}` },
  });

  assert(choferesResponse.ok, `Obtener choferes falló: ${JSON.stringify(choferesBody)}`);
  assert(Array.isArray(choferesBody), 'La respuesta de /choferes debe ser un array');

  const chofer = choferesBody.find((item) => item.email === expectedChoferEmail) || choferRecord;
  assert(chofer, `No se encontró el chofer con email ${expectedChoferEmail}`);
  assert(typeof chofer.id === 'number', 'chofer.id debe ser un número');

  console.log('3) Crear encomienda asignada al chofer para hoy y otra para mañana');
  const fechaHoy = new Date().toISOString().split('T')[0];
  const fechaManana = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const encomiendaHoy = {
    tipo: 'SALIENTE',
    estado: 'Pendiente',
    direccion_destino: 'Calle de prueba 123',
    fecha_creacion: new Date().toISOString(),
    fecha_entrega: fechaHoy,
    descripcion: 'Encomienda de prueba automatizada - hoy',
    precio: 100,
    origen_id: localidadId,
    destino_id: localidadId,
    cliente_id: clienteId,
    cliente_destinatario_id: clienteId,
    chofer_id: chofer.id,
  };

  const encomiendaManana = {
    ...encomiendaHoy,
    fecha_entrega: fechaManana,
    descripcion: 'Encomienda de prueba automatizada - mañana',
  };

  const { response: createHoyResponse, body: createHoyBody } = await fetchJson(`${baseUrl}/encomiendas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${admin.token}`,
    },
    body: JSON.stringify(encomiendaHoy),
  });

  const { response: createMananaResponse, body: createMananaBody } = await fetchJson(`${baseUrl}/encomiendas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${admin.token}`,
    },
    body: JSON.stringify(encomiendaManana),
  });

  console.log('create hoy response status', createHoyResponse.status, createHoyBody);
  console.log('create manana response status', createMananaResponse.status, createMananaBody);

  assert(createHoyResponse.ok, `Creación de encomienda de hoy falló: ${JSON.stringify(createHoyBody)}`);
  assert(createMananaResponse.ok, `Creación de encomienda de mañana falló: ${JSON.stringify(createMananaBody)}`);
  assert(createHoyBody.id, 'La encomienda de hoy debe incluir id');
  assert(createMananaBody.id, 'La encomienda de mañana debe incluir id');

  console.log('4) Login como chofer');
  const choferLogin = await loginUser(choferCreds);

  console.log('5) Consultar /encomiendas/fecha para hoy');
  const { response: fechaResponse, body: fechaBody } = await fetchJson(
    `${baseUrl}/encomiendas/fecha?fecha=${fechaHoy}`,
    {
      headers: { Authorization: `Bearer ${choferLogin.token}` },
    }
  );

  console.log('fecha response status', fechaResponse.status);
  console.log('fecha response body', fechaBody);

  assert(fechaResponse.ok, `Consulta por fecha falló: ${JSON.stringify(fechaBody)}`);
  assert(Array.isArray(fechaBody), 'La respuesta de /encomiendas/fecha debe ser un array');
  assert(
    fechaBody.some((item) => item.id === createHoyBody.id || item.encomienda_id === createHoyBody.id),
    `La encomienda de hoy no fue devuelta para la fecha ${fechaHoy}`
  );
  assert(
    !fechaBody.some((item) => item.id === createMananaBody.id || item.encomienda_id === createMananaBody.id),
    `La encomienda de mañana apareció en la vista de hoy del chofer`
  );

  console.log('6) Consultar /encomiendas/chofer/:id/hoy');
  const { response: hoyResponse, body: hoyBody } = await fetchJson(
    `${baseUrl}/encomiendas/chofer/${chofer.id}/hoy`,
    {
      headers: { Authorization: `Bearer ${choferLogin.token}` },
    }
  );

  console.log('hoy response status', hoyResponse.status);
  console.log('hoy response body', hoyBody);

  assert(hoyResponse.ok, `La ruta de hoy del chofer falló: ${JSON.stringify(hoyBody)}`);
  assert(Array.isArray(hoyBody), 'La respuesta de /encomiendas/chofer/:id/hoy debe ser un array');
  assert(
    hoyBody.some((item) => item.id === createHoyBody.id || item.encomienda_id === createHoyBody.id),
    'La ruta de hoy del chofer no incluye la encomienda del día actual'
  );
  assert(
    !hoyBody.some((item) => item.id === createMananaBody.id || item.encomienda_id === createMananaBody.id),
    'La ruta de hoy del chofer no debe incluir encomiendas de mañana'
  );

  const found = fechaBody.find((item) => item.id === createHoyBody.id || item.encomienda_id === createHoyBody.id);
  assert(found, 'No se encontró la encomienda de hoy en la respuesta');
  assert(
    found.chofer_id === chofer.id || found.chofer?.id === chofer.id,
    'La encomienda devuelta no está asignada al chofer correcto'
  );
  assert(found.fecha_entrega || found.fechaEntrega, 'La encomienda debe incluir fecha_entrega');

  console.log('✅ Test completado con éxito: el chofer ve solo las encomiendas del día actual y no las de mañana.');
}

runTest().catch((error) => {
  console.error('❌ Test falló:', error);
  process.exit(1);
});
