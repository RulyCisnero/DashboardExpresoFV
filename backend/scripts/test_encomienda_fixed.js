(async () => {
  const base = 'http://localhost:5100/api';
  const adminCreds = { email: 'admin@test.com', password: 'password123' };
  const choferEmail = 'chofer@test.com';

  try {
    // Login admin
    let res = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminCreds),
    });
    const adminLogin = await res.json();
    if (!res.ok) { console.error('Admin login failed', adminLogin); return; }
    const adminToken = adminLogin.token;

    // Get choferes and find by email
    res = await fetch(base + '/choferes', {
      headers: { Authorization: 'Bearer ' + adminToken }
    });
    const choferes = await res.json();
    const chofer = (Array.isArray(choferes) ? choferes : choferes.value).find(c => c.email === choferEmail);
    if (!chofer) { console.error('Chofer not found by email', choferEmail); return; }

    const choferId = chofer.id;
    console.log('Using chofer id', choferId);

    // Create encomienda for tomorrow assigned to that chofer
    const tomorrow = new Date(Date.now() + 24*60*60*1000);
    const fechaEntrega = tomorrow.toISOString().split('T')[0];

    const newEncomienda = {
      tipo: 'SALIENTE',
      estado: 'Pendiente',
      direccion_destino: 'Calle de prueba 123',
      fecha_creacion: new Date().toISOString(),
      fecha_entrega: fechaEntrega,
      descripcion: 'Encomienda de prueba asignada',
      precio: 100,
      origen_id: 1,
      destino_id: 1,
      cliente_id: 1,
      cliente_destinatario_id: 1,
      chofer_id: choferId
    };

    res = await fetch(base + '/encomiendas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + adminToken },
      body: JSON.stringify(newEncomienda)
    });
    const created = await res.json();
    console.log('Create encomienda status', res.status, created);

    // Login as that chofer
    const choferCreds = { email: choferEmail, password: 'password123' };
    res = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(choferCreds),
    });
    const choferLogin = await res.json();
    if (!res.ok) { console.error('Chofer login failed', choferLogin); return; }
    const choferToken = choferLogin.token;

    // Fetch encomiendas for fechaEntrega as chofer
    res = await fetch(base + '/encomiendas/fecha?fecha=' + fechaEntrega, {
      headers: { Authorization: 'Bearer ' + choferToken }
    });
    const encomiendas = await res.json();
    console.log('Encomiendas for chofer on', fechaEntrega, encomiendas);
  } catch (err) {
    console.error('Error during test flow', err);
  }
})();
