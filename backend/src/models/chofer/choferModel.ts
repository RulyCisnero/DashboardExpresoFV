import pool from '../../database/connectionPostgreSQL.ts';
import type { IChofer, IChoferVista } from '../../interfaces/Index.ts';

class ChoferModel {
    async createChofer(choferData: Omit<IChofer, "id">): Promise<IChofer> {
        try {
            const Query = `
          INSERT INTO chofer (nombre, apellido, telefono, email)
          VALUES ($1, $2, $3, $4)
          RETURNING id, nombre, apellido, telefono, email;
          `;

            const insertValues = [
                choferData.nombre,
                choferData.apellido,
                choferData.telefono,
                choferData.email
            ];

            const insertResult = await pool.query(Query, insertValues);
            return insertResult.rows[0];


        } catch (error) {
            console.error("Error en el modelo crearteChofer: ", error);
            throw error;
        }
    }

    async getChoferById(id: number): Promise<IChofer> {
        try {
            const result = await pool.query("SELECT * FROM chofer WHERE id = $1", [id]);
            if (result.rows.length === 0) {
                throw new Error("Chofer no encontrado");
            }
            return result.rows[0];
        } catch (error) {
            console.error("Error en el modelo getChoferById:", error);
            throw error;
        }
    }

    async getAllChoferes(): Promise<IChoferVista[]> {
        try {
            const result = await pool.query("SELECT * FROM chofer ch ORDER BY ch.id ASC");
            return result.rows.map(row => ({
                id: row.id,
                nombre: row.nombre,
                apellido: row.apellido,
                telefono: row.telefono,
                email: row.email
            }));
        } catch (error) {
            console.error("Error en el metodo getAllChoferes: ", error);
            throw error;
        }
    };

    async updateChofer(id: number, choferData: Omit<IChofer, "id">): Promise<IChofer> {
        try {
            const { nombre, apellido, telefono, email } = choferData;
            const result = await pool.query(
                'UPDATE chofer SET nombre = $1, apellido = $2, telefono = $3, email = $4 WHERE id = $5 RETURNING *',
                [nombre, apellido, telefono, email, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error en el metodo updateChofer:", error);
            throw error;
        }
    }

    async deleteChofer(id: number): Promise<boolean> {
        try {
            const result = await pool.query('DELETE FROM chofer WHERE id = $1', [id]);
            if (result.rowCount !== null && result.rowCount > 0) {
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error en el metodo deleteChofer: ",error);
            throw error;
        }
    };
};

export default new ChoferModel();