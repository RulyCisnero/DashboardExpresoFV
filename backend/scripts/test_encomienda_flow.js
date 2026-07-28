(async () => {
  const base = 'http://localhost:5100/api';
  const fetch = globalThis.fetch;
  const adminCreds = { email: 'admin@test.com', password: 'password123' };
  const choferCreds = { email: 'chofer@test.com', password: 'password123' };

  try {
    // Login admin
    let res = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminCreds),
    });
    const adminLogin = await res.json();
    console.log('Admin login status', res.status);
    if (!res.ok) { console.log(adminLogin); return; }
    const adminToken = adminLogin.token;

    // Get choferes
    res = await fetch(base + '/choferes', {
      headers: { Authorization: 'Bearer ' + adminToken }
    });
    const choferes = await res.json();
    console.log('Choferes count', Array.isArray(choferes) ? choferes.length : 'err');
    if (!Array.isArray(choferes) || choferes.length === 0) { console.log('No choferes found'); return; }
    const choferId = choferes[0].id;
    console.log('Using chofer id', choferId);

    // Create encomienda for tomorrow
    const tomorrow = new Date(Date.now() + 24*60*60*1000);
    const fechaEntrega = tomorrow.toISOString().split('T')[0];

    const newEncomienda = {
      tipo: 'SALIENTE',
      estado: 'Pendiente',
      direccion_destino: 'Calle de prueba 123',
      fecha_creacion: new Date().toISOString(),
      fecha_entrega: fechaEntrega,
      descripcion: 'Encomienda de prueba',
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

    // Login as chofer
    res = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(choferCreds),
    });
    const choferLogin = await res.json();
    console.log('Chofer login status', res.status);
    if (!res.ok) { console.log(choferLogin); return; }
    const choferToken = choferLogin.token;

    // Fetch encomiendas for fechaEntrega
    res = await fetch(base + '/encomiendas/fecha?fecha=' + fechaEntrega, {
      headers: { Authorization: 'Bearer ' + choferToken }
    });
    const encomiendas = await res.json();
    console.log('Encomiendas for chofer on', fechaEntrega, encomiendas);
  } catch (err) {
    console.error('Error during test flow', err);
  }
})();
