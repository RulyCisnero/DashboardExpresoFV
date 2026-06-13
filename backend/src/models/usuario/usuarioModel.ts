import pool from '../../database/connectionPostgreSQL.ts';
import type { IUsuario, Rol } from '../../interfaces/usuario.ts';
import { bcryptUtils } from '../../utils/bcrypt.ts';

export class UsuarioModel {
  static async getUsuarioByEmail(email: string): Promise<IUsuario | null> {
    const query = `
      SELECT u.id, u.email, u.nombre_usuario, u.nombre, u.apellido, u.rol_id, u.activo, u.fecha_creacion, u.ultima_conexion
      FROM usuario u
      WHERE u.email = $1 AND u.activo = true
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async getUsuarioById(id: number): Promise<(IUsuario & { rol: string }) | null> {
    const query = `
      SELECT u.id, u.email, u.nombre_usuario, u.nombre, u.apellido, u.rol_id, u.activo, u.fecha_creacion, u.ultima_conexion, r.nombre as rol
      FROM usuario u
      JOIN rol r ON u.rol_id = r.id
      WHERE u.id = $1 AND u.activo = true
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async getUsuarioWithPasswordByEmail(email: string): Promise<(IUsuario & { password_hash: string; rol: string }) | null> {
    const query = `
      SELECT u.id, u.email, u.nombre_usuario, u.nombre, u.apellido, u.password_hash, u.rol_id, u.activo, u.fecha_creacion, u.ultima_conexion, r.nombre as rol
      FROM usuario u
      JOIN rol r ON u.rol_id = r.id
      WHERE u.email = $1 AND u.activo = true
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async createUsuario(data: {
    email: string;
    nombre_usuario: string;
    nombre: string;
    apellido: string;
    password: string;
    rol_id: number;
  }): Promise<IUsuario> {
    const passwordHash = await bcryptUtils.hashPassword(data.password);

    const query = `
      INSERT INTO usuario (email, nombre_usuario, nombre, apellido, password_hash, rol_id, activo, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true, CURRENT_TIMESTAMP)
      RETURNING id, email, nombre_usuario, nombre, apellido, rol_id, activo, fecha_creacion
    `;

    const result = await pool.query(query, [
      data.email,
      data.nombre_usuario,
      data.nombre,
      data.apellido,
      passwordHash,
      data.rol_id,
    ]);

    return result.rows[0];
  }

  static async getRol(rolId: number): Promise<Rol | null> {
    const query = `SELECT nombre FROM rol WHERE id = $1`;
    const result = await pool.query(query, [rolId]);
    return result.rows[0]?.nombre || null;
  }

  static async updateUltimaConexion(usuarioId: number): Promise<void> {
    const query = `
      UPDATE usuario
      SET ultima_conexion = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await pool.query(query, [usuarioId]);
  }

  static async verificarEmailExiste(email: string): Promise<boolean> {
    const query = `SELECT id FROM usuario WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  }

  static async verificarUsuarioExiste(nombre_usuario: string): Promise<boolean> {
    const query = `SELECT id FROM usuario WHERE nombre_usuario = $1`;
    const result = await pool.query(query, [nombre_usuario]);
    return result.rows.length > 0;
  }
}
