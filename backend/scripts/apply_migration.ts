import pool from '../src/database/connectionPostgreSQL.ts';

(async ()=>{
  try{
    console.log('Ejecutando ALTER TABLE...');
    await pool.query("ALTER TABLE encomienda ADD COLUMN IF NOT EXISTS fecha_entrega DATE;");
    console.log('Migración aplicada');
    process.exit(0);
  }catch(err){
    console.error('Error aplicando migración', err);
    process.exit(1);
  }
})();
