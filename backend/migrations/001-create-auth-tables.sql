-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS rol (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  rol_id INTEGER NOT NULL,
  localidad_id INTEGER,
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_conexion TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES rol(id) ON DELETE RESTRICT,
  FOREIGN KEY (localidad_id) REFERENCES localidad(id) ON DELETE SET NULL
);

-- Insertar roles iniciales
INSERT INTO rol (nombre, descripcion) VALUES
  ('superUsuario', 'Acceso total del sistema'),
  ('administrador', 'Gestión de datos y usuarios'),
  ('personal', 'Consulta de datos'),
  ('chofer', 'Visualización de encomiendas asignadas')
ON CONFLICT (nombre) DO NOTHING;

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuario(email);
CREATE INDEX IF NOT EXISTS idx_usuario_rol_id ON usuario(rol_id);
CREATE INDEX IF NOT EXISTS idx_usuario_localidad_id ON usuario(localidad_id);
CREATE INDEX IF NOT EXISTS idx_usuario_activo ON usuario(activo);
