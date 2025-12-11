import pool from '../../database/connectionPostgreSQL.ts';
import type { Localidad } from '../../interfaces/localidad.ts';

class LocalidadModel {
    async getAllLocalidades(): Promise<Localidad[]> {
        try {
            const result = await pool.query('SELECT * FROM localidad ORDER BY id ASC');
            return result.rows;
        } catch (error) {
            console.error("Error en el modelo getAll Localidades: ", error);
            throw error;
        }
    }

    async getLocalidadById(id: number): Promise<Localidad | null> {
        try {
            const result = await pool.query('SELECT * FROM localidad WHERE id = $1', [id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error("Error en el modelo getLocalidadById: ", error);
            throw error;
        }
    }

    async createLocalidad(nombre: string): Promise<Localidad> {
        try {
            const result = await pool.query('INSERT INTO localidad (nombre) VALUES ($1) RETURNING *', [nombre]);
            return result.rows[0];
        } catch (error) {
            console.error("Error en el modelo createLocalidad: ", error);
            throw error;
        }
    }

    async updateLocalidad(id: number, nombre: string): Promise<Localidad | null> {
        try {
            const result = await pool.query('UPDATE localidad SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error("Error en el modelo UpdateLocalidad: ", error);
            throw error;
        }
    }

    async deleteLocalidad(id: number): Promise<boolean> {
        try {
            const result = await pool.query('DELETE FROM localidad WHERE id = $1', [id]);
            if (result.rowCount !== null && result.rowCount > 0) {
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error en el modelo DeleteLocalidad: ", error);
            throw error
        }
    }
};
export default new LocalidadModel();
