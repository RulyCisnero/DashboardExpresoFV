import pool from '../../database/connectionPostgreSQL.ts';
import type { ICliente, IClienteVista } from '../../interfaces/Index.ts'

class ClienteModel {
    async createCliente(clienteData: Omit<ICliente, "id">): Promise<IClienteVista> {
        try {
            const { nombre, apellido, direccion_local, telefono, email, id_localidad } = clienteData;
            const insertQuery = `
            INSERT INTO cliente (nombre, apellido, direccion_local, telefono, email, id_localidad)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, nombre, apellido, direccion_local, telefono, email, id_localidad
            `;
            const insertValues = [nombre, apellido, direccion_local, telefono, email, id_localidad];
            const insertResult = await pool.query(insertQuery, insertValues);
            const newCliente = insertResult.rows[0];

            // Traer localidad
            const locResult = await pool.query('SELECT id, nombre FROM localidad WHERE id = $1', [id_localidad]);
            const localidad = locResult.rows[0];

            if (!localidad) {
                throw new Error(`Localidad con id ${id_localidad} no encontrada`);
            }

            return {
                id: newCliente.id,
                nombre: newCliente.nombre,
                apellido: newCliente.apellido,
                direccion_local: newCliente.direccion_local,
                telefono: newCliente.telefono,
                email: newCliente.email,
                localidad: {
                    id: localidad.id,
                    nombre: localidad.nombre
                }
            };
        } catch (error) {
            console.error("Error en el modelo createCliente: ", error);
            throw error;
        }
    }

    async getClienteById(id: number): Promise<IClienteVista> {
        try {
            const query = `
            SELECT c.id, c.nombre, c.apellido, c.direccion_local, c.telefono, c.email,
                   l.id AS localidad_id, l.nombre AS localidad_nombre
            FROM cliente c
            JOIN localidad l ON c.id_localidad = l.id
            WHERE c.id = $1
            `;
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error("Cliente no encontrado");
            }

            const row = result.rows[0];
            return {
                id: row.id,
                nombre: row.nombre,
                apellido: row.apellido,
                direccion_local: row.direccion_local,
                telefono: row.telefono,
                email: row.email,
                localidad: {
                    id: row.localidad_id,
                    nombre: row.localidad_nombre
                }
            };
        } catch (error) {
            console.error("Error en el modelo getClienteById: ", error);
            throw error;
        }

    }

    async getAllClientes(): Promise<IClienteVista[]> {
        try {
            const query = `
            SELECT c.id, c.nombre, c.apellido, c.direccion_local, c.telefono, c.email,
                   l.id AS localidad_id, l.nombre AS localidad_nombre
            FROM cliente c
            JOIN localidad l ON c.id_localidad = l.id
            ORDER BY c.id ASC
             `;
            const result = await pool.query(query);
            return result.rows.map(row => ({
                id: row.id,
                nombre: row.nombre,
                apellido: row.apellido,
                direccion_local: row.direccion_local,
                telefono: row.telefono,
                email: row.email,
                localidad: {
                    id: row.localidad_id,
                    nombre: row.localidad_nombre
                }
            }));
        } catch (error) {
            console.error("Error en el modelo getAllClientes: ", error);
            throw error;
        }
    }

    async updateCliente(id: number, clienteData: Partial<Omit<ICliente, "id" | "localidad">> & { id_localidad?: number }): Promise<ICliente> {
        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const key in clienteData) {
            fields.push(`${key} = $${index}`);
            values.push((clienteData as any)[key]);
            index++;
        }

        const query = `UPDATE cliente SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;
        values.push(id);

        const result = await pool.query(query, values);
        const updated = result.rows[0];

        // Traer localidad
        const locId = clienteData.id_localidad ?? updated.id_localidad;
        const locResult = await pool.query('SELECT id, nombre FROM localidad WHERE id = $1', [locId]);
        const localidad = locResult.rows[0];

        return {
            id: updated.id,
            nombre: updated.nombre,
            apellido: updated.apellido,
            direccion_local: updated.direccion_local,
            telefono: updated.telefono,
            email: updated.email,
            id_localidad: updated.id_localidad
            /* localidad: {
                id: localidad.id,
                nombre: localidad.nombre
            } */
        };
    }

    async updateCliente2(
        // Recibe el ID del cliente y un objeto con los campos a actualizar.
        // Se usa `Partial` para permitir que lleguen solo algunos campos (no todos obligatorios).
        id: number,
        clienteData: Partial<Omit<ICliente, "id" | "localidad">> & { id_localidad?: number }
    ): Promise<IClienteVista> {
        try {
            // 🔹 Validación inicial: si no se recibió ningún campo, lanza error.
            if (Object.keys(clienteData).length === 0) {
                throw new Error("No se recibieron campos para actualizar");
            }

            // 🔹 `fields` contendrá los nombres de las columnas a actualizar (ej: "nombre = $1")
            // 🔹 `values` contendrá los valores que van a reemplazar en el query.
            const fields: string[] = [];
            const values: any[] = [];
            let index = 1; // contador para las posiciones de los parámetros ($1, $2, ...)

            // 🔹 Recorre dinámicamente los campos que vinieron en `clienteData`
            // y construye el query de forma automática.
            for (const key in clienteData) {
                fields.push(`${key} = $${index}`); // agrega "campo = $1"
                values.push((clienteData as any)[key]); // agrega el valor del campo
                index++;
            }

            // 🔹 Crea el query final concatenando los campos actualizables.
            //    Ejemplo resultante: UPDATE cliente SET nombre=$1, telefono=$2 WHERE id=$3 RETURNING *
            const query = `UPDATE cliente SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;
            values.push(id); // agrega el ID al final de los valores

            // 🔹 Ejecuta la consulta y obtiene el resultado
            const result = await pool.query(query, values);

            // 🔹 Si no se modificó ninguna fila, significa que el cliente no existe.
            if (result.rowCount === 0) {
                throw new Error(`Cliente con id ${id} no encontrado`);
            }

            // 🔹 Guarda el cliente actualizado
            const updated = result.rows[0];

            // 🔹 Determina qué ID de localidad usar:
            //    - si vino uno nuevo en `clienteData`, usa ese;
            //    - si no, mantiene el que ya tenía el cliente.
            const locId = clienteData.id_localidad ?? updated.id_localidad;

            // 🔹 Obtiene la información completa de la localidad relacionada
            const locResult = await pool.query('SELECT id, nombre FROM localidad WHERE id = $1', [locId]);
            const localidad = locResult.rows[0];

            // 🔹 Retorna el cliente actualizado con la estructura de IClienteVista
            return {
                id: updated.id,
                nombre: updated.nombre,
                apellido: updated.apellido,
                direccion_local: updated.direccion_local,
                telefono: updated.telefono,
                email: updated.email,
                localidad: {
                    id: localidad.id,
                    nombre: localidad.nombre
                }
            };

        } catch (error) {
            // 🔹 Manejo de errores centralizado
            console.error("Error en updateCliente:", error);
            throw error;
        }
    }

    async deleteCliente(id: number): Promise<ICliente | null> {
        try {
            const result = await pool.query('DELETE FROM cliente WHERE id = $1 RETURNING *', [id]);
            if (result.rowCount === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            console.error("Error en el metodo deleteCliente: ", error);
            throw error;
        }
    }

    async searchCliente(searchParams: string): Promise<ICliente[]> {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM cliente WHERE nombre ILIKE $1 OR apellido ILIKE $1`,
                [`%${searchParams}%`]
            );
            return rows;
        } catch (error) {
            console.error("Error en el metodo searchCliente: ", error);
            throw error;
        }
    };
    async searchCliente2(searchParams: string): Promise<IClienteVista[]> {
        try {
            const query = `
            SELECT 
            c.id, c.nombre, c.apellido, c.direccion_local, c.telefono, c.email,
            l.id AS localidad_id, l.nombre AS localidad_nombre
            FROM cliente c
            LEFT JOIN localidad l ON c.id_localidad = l.id
            WHERE 
            c.nombre ILIKE $1 OR 
            c.apellido ILIKE $1 OR 
            c.telefono ILIKE $1 OR 
            c.email ILIKE $1
            ORDER BY c.apellido, c.nombre;
            `;
            const { rows } = await pool.query(query, [`%${searchParams}%`]);

            // Formateamos el resultado para que coincida con la interfaz IClienteVista
            return rows.map(row => ({
                id: row.id,
                nombre: row.nombre,
                apellido: row.apellido,
                direccion_local: row.direccion_local,
                telefono: row.telefono,
                email: row.email,
                localidad: {
                    id: row.localidad_id,
                    nombre: row.localidad_nombre
                }
            }));
        } catch (error) {
            console.error("Error en el método searchCliente:", error);
            throw error;
        }
    }

}

export default new ClienteModel();
