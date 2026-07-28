import pool from '../src/database/connectionPostgreSQL.ts';

(async function(){
  try{
    const query = `
      INSERT INTO encomienda (
        tipo, estado, direccion_destino, fecha_creacion, fecha_entrega, descripcion, precio, origen_id, destino_id, cliente_id, cliente_destinatario_id, chofer_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *;
    `;

    const values = [
      'SALIENTE',
      'Pendiente',
      'Calle x',
      new Date().toISOString(),
      new Date(Date.now()+24*3600*1000).toISOString().split('T')[0],
      'prueba',
      100,
      1,
      1,
      1,
      1,
      1
    ];

    const res = await pool.query(query, values);
    console.log('INSERT RESULT:', res.rows[0]);
    process.exit(0);
  }catch(err){
    console.error('INSERT ERROR:', err);
    process.exit(1);
  }
})();
