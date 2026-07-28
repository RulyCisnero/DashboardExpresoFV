import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

const baseUrl = 'http://localhost:5100/api';
const choferCreds = { email: 'chofer@test.com', password: 'password123' };

async function run() {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(choferCreds),
  });
  const body = await res.json();
  console.log('login status', res.status, body);
  if (!res.ok) return;
  const token = body.token;
  console.log('decoded token', jwt.decode(token));

  const fecha = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const res2 = await fetch(`${baseUrl}/encomiendas/fecha?fecha=${fecha}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body2 = await res2.json();
  console.log('fecha status', res2.status, body2);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
