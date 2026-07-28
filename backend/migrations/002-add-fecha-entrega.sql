-- Agrega la columna fecha_entrega a la tabla encomienda
ALTER TABLE encomienda
ADD COLUMN IF NOT EXISTS fecha_entrega DATE;

-- Opcional: si quieres inicializar con la fecha_creacion para filas actuales (descomentar)
-- UPDATE encomienda SET fecha_entrega = DATE(fecha_creacion) WHERE fecha_entrega IS NULL;
