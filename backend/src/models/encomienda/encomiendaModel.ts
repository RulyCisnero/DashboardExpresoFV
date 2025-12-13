import pool from '../../database/connectionPostgreSQL.ts';
import type { IEncomienda, IEncomiendaVista } from '../../interfaces/Index.ts'

class EncomiendaModel {
    async createEncomienda(encomiendaData: IEncomienda): Promise<IEncomienda> {
        try {
            const query =
                `
         INSERT INTO encomienda (
          tipo, 
          estado, 
          direccion_destino,
          fecha_creacion,
          descripcion, 
          precio,
          origen_id, 
          destino_id,
          cliente_id, 
          cliente_destinatario_id,
          chofer_id 
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *;
         `;

            const values = [
                encomiendaData.tipo,
                encomiendaData.estado,
                encomiendaData.direccion_destino,
                encomiendaData.fecha_creacion,
                encomiendaData.descripcion,
                encomiendaData.precio,
                encomiendaData.origen_id,
                encomiendaData.destino_id,
                encomiendaData.cliente_id,
                encomiendaData.cliente_destinatario_id,
                encomiendaData.chofer_id,
            ];
            const result = await pool.query(query, values);
            if (result.rowCount === 0) {
                throw new Error("No se pudo crear la encomienda");
            }
            return result.rows[0];
        } catch (error) {
            console.error("Error en el modelo CreateEncomienda: ", error);
            throw error;
        }
    };

    async getEncomiendaById(id: number): Promise<IEncomiendaVista | null> {
        try {
            const query = `
            SELECT
            e.id AS encomienda_id,
            e.tipo,
            e.estado,
            e.direccion_destino,
            e.fecha_creacion,
            e.descripcion,
            e.precio,

            -- Cliente remitente
            c.id AS cliente_id,
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,
            c.direccion_local AS cliente_direccion,
            c.telefono AS cliente_telefono,
            c.email AS cliente_email,
            lc.id AS cliente_localidad_id,
            lc.nombre AS cliente_localidad_nombre,

            -- Cliente destinatario
            cd.id AS destinatario_id,
            cd.nombre AS destinatario_nombre,
            cd.apellido AS destinatario_apellido,
            cd.direccion_local AS destinatario_direccion,
            cd.telefono AS destinatario_telefono,
            cd.email AS destinatario_email,
            lcd.id AS destinatario_localidad_id,
            lcd.nombre AS destinatario_localidad_nombre,

            -- Chofer
            ch.id AS chofer_id,
            ch.nombre AS chofer_nombre,
            ch.apellido AS chofer_apellido,
            ch.telefono AS chofer_telefono,
            ch.email AS chofer_email,

            -- Origen y destino
            lo.id AS origen_id,
            lo.nombre AS origen_nombre,
            ld.id AS destino_id,
            ld.nombre AS destino_nombre

            FROM encomienda e
            LEFT JOIN cliente c ON e.cliente_id = c.id
            LEFT JOIN localidad lc ON c.id_localidad = lc.id
            LEFT JOIN cliente cd ON e.cliente_destinatario_id = cd.id
            LEFT JOIN localidad lcd ON cd.id_localidad = lcd.id
            LEFT JOIN chofer ch ON e.chofer_id = ch.id
            LEFT JOIN localidad lo ON e.origen_id = lo.id
            LEFT JOIN localidad ld ON e.destino_id = ld.id
            WHERE e.id = $1;
            `;

            const result = await pool.query(query, [id]);
            if (result.rowCount === 0) return null;

            const row = result.rows[0];
            return {
                id: row.encomienda_id,
                tipo: row.tipo,
                estado: row.estado,
                direccion_destino: row.direccion_destino,
                fecha_creacion: row.fecha_creacion,
                descripcion: row.descripcion,
                precio: row.precio,

                origen: {
                    id: row.origen_id,
                    nombre: row.origen_nombre,
                },

                destino: {
                    id: row.destino_id,
                    nombre: row.destino_nombre,
                },

                cliente: {
                    id: row.cliente_id,
                    nombre: row.cliente_nombre,
                    apellido: row.cliente_apellido,
                    direccion_local: row.cliente_direccion,
                    telefono: row.cliente_telefono,
                    email: row.cliente_email,
                    localidad: {
                        id: row.cliente_localidad_id,
                        nombre: row.cliente_localidad_nombre,
                    },
                },

                destinatario: {
                    id: row.destinatario_id,
                    nombre: row.destinatario_nombre,
                    apellido: row.destinatario_apellido,
                    direccion_local: row.destinatario_direccion,
                    telefono: row.destinatario_telefono,
                    email: row.destinatario_email,
                    localidad: {
                        id: row.destinatario_localidad_id,
                        nombre: row.destinatario_localidad_nombre
                    },
                },
                chofer: row.chofer_id
                    ? {
                        id: row.chofer_id,
                        nombre: row.chofer_nombre,
                        apellido: row.chofer_apellido,
                        telefono: row.chofer_telefono,
                        email: row.chofer_email,
                    }
                    : null,
            };
        } catch (error) {
            console.error("Error en el metodo getEncomiendaById: ", error);
            throw error;
        }
    }


    async getAllEncomiendas(): Promise<IEncomiendaVista[]> {
        try {
            const query = `
        SELECT
        e.id AS encomienda_id,
        e.tipo,
        e.estado,
        e.direccion_destino,
        e.fecha_creacion,
        e.descripcion,
        e.precio,

        -- Cliente remitente
        c.id AS cliente_id,
        c.nombre AS cliente_nombre,
        c.apellido AS cliente_apellido,
        c.direccion_local AS cliente_direccion,
        c.telefono AS cliente_telefono,
        c.email AS cliente_email,
        lc.id AS cliente_localidad_id,
        lc.nombre AS cliente_localidad_nombre,

        -- Cliente destinatario
        cd.id AS destinatario_id,
        cd.nombre AS destinatario_nombre,
        cd.apellido AS destinatario_apellido,
        cd.direccion_local AS destinatario_direccion,
        cd.telefono AS destinatario_telefono,
        cd.email AS destinatario_email,
        lcd.id AS destinatario_localidad_id,
        lcd.nombre AS destinatario_localidad_nombre,

        -- Chofer
        ch.id AS chofer_id,
        ch.nombre AS chofer_nombre,
        ch.apellido AS chofer_apellido,
        ch.telefono AS chofer_telefono,
        ch.email AS chofer_email,

        -- Origen y destino
        lo.id AS origen_id,
        lo.nombre AS origen_nombre,
        ld.id AS destino_id,
        ld.nombre AS destino_nombre

        FROM encomienda e
        LEFT JOIN cliente c ON e.cliente_id = c.id
        LEFT JOIN localidad lc ON c.id_localidad = lc.id
        LEFT JOIN cliente cd ON e.cliente_destinatario_id = cd.id
        LEFT JOIN localidad lcd ON cd.id_localidad = lcd.id
        LEFT JOIN chofer ch ON e.chofer_id = ch.id
        LEFT JOIN localidad lo ON e.origen_id = lo.id
        LEFT JOIN localidad ld ON e.destino_id = ld.id`

            const result = await pool.query(query);
            return result.rows.map(row => ({
                id: row.encomienda_id,
                tipo: row.tipo,
                estado: row.estado,
                direccion_destino: row.direccion_destino,
                fecha_creacion: new Date(row.fecha_creacion), // Convertir a Date
                descripcion: row.descripcion,
                precio: parseFloat(row.precio), // Convertir a número

                // Objetos completos para relaciones
                origen: {
                    id: row.origen_id,
                    nombre: row.origen_nombre
                },

                destino: {
                    id: row.destino_id,
                    nombre: row.destino_nombre
                },

                cliente: {
                    id: row.cliente_id,
                    nombre: row.cliente_nombre,
                    apellido: row.cliente_apellido,
                    direccion_local: row.cliente_direccion,
                    telefono: row.cliente_telefono,
                    email: row.cliente_email,
                    localidad: {
                        id: row.cliente_localidad_id,
                        nombre: row.cliente_localidad_nombre
                    }
                },

                destinatario: {
                    id: row.destinatario_id,
                    nombre: row.destinatario_nombre,
                    apellido: row.destinatario_apellido,
                    direccion_local: row.destinatario_direccion,
                    telefono: row.destinatario_telefono,
                    email: row.destinatario_email,
                    localidad: { id: row.destinatario_localidad_id, nombre: row.destinatario_localidad_nombre }
                },

                chofer: row.chofer_id ? {
                    id: row.chofer_id,
                    nombre: row.chofer_nombre,
                    apellido: row.chofer_apellido,
                    telefono: row.chofer_telefono,
                    email: row.chofer_email
                } : null
            }));
        } catch (error) {
            console.error("Error en el metodo getAllEncomiendas: ", error);
            throw error;
        }
    }

    async filtrarEncomiendas(filtros: { estado?: string, cliente_id?: number, chofer_id?: number }): Promise<IEncomiendaVista[]> {
        try {
            let query = `
        SELECT 
        e.id,
        e.tipo,
        e.estado,
        e.direccion_destino,
        e.fecha_creacion,
        e.descripcion,
        e.precio,

        -- CLIENTE
        c.id AS cliente_id,
        c.nombre AS cliente_nombre,
        c.apellido AS cliente_apellido,
        c.direccion_local AS cliente_direccion_local,
        c.telefono AS cliente_telefono,
        c.email AS cliente_email,
        lc.id AS cliente_localidad_id,
        lc.nombre AS cliente_localidad_nombre,

        -- CHOFER
        ch.id AS chofer_id,
        ch.nombre AS chofer_nombre,
        ch.apellido AS chofer_apellido,
        ch.telefono AS chofer_telefono,
        ch.email AS chofer_email,
        ch.destino_id AS chofer_destino_id,

        -- LOCALIDADES
        lo.id AS origen_id,
        lo.nombre AS origen_nombre,
        ld.id AS destino_id,
        ld.nombre AS destino_nombre

        FROM encomienda e
        JOIN cliente c ON e.cliente_id = c.id
        LEFT JOIN localidad lc ON c.id_localidad = lc.id
        LEFT JOIN chofer ch ON e.chofer_id = ch.id
        LEFT JOIN localidad lo ON e.origen_id = lo.id
        LEFT JOIN localidad ld ON e.destino_id = ld.id
        `;
            const conditions: string[] = [];
            const values: any = [];
            if (filtros.estado) {
                values.push(filtros.estado);
                conditions.push(`e.estado = $${values.length}`);
            }

            if (filtros.cliente_id) {
                values.push(filtros.cliente_id);
                conditions.push(`e.cliente_id = $${values.length}`);
            }

            if (filtros.chofer_id) {
                values.push(filtros.chofer_id);
                conditions.push(`e.chofer_id = $${values.length}`);
            }

            if (conditions.length > 0) {
                query += ` WHERE ` + conditions.join(' AND ');
            }
            query += ' ORDER BY e.id DESC';
            const result = await pool.query(query, values);

            return result.rows.map(row => ({
                id: row.id,
                tipo: row.tipo,
                estado: row.estado,
                direccion_destino: row.direccion_destino,
                fecha_creacion: new Date(row.fecha_creacion), // Convertir a Date
                descripcion: row.descripcion,
                precio: parseFloat(row.precio), // Convertir a número

                // Objetos completos para relaciones
                origen: {
                    id: row.origen_id,
                    nombre: row.origen_nombre
                },

                destino: {
                    id: row.destino_id,
                    nombre: row.destino_nombre
                },

                cliente: {
                    id: row.cliente_id,
                    nombre: row.cliente_nombre,
                    apellido: row.cliente_apellido,
                    direccion_local: row.cliente_direccion_local,
                    telefono: row.cliente_telefono,
                    email: row.cliente_email,
                    localidad: {
                        id: row.cliente_localidad_id,
                        nombre: row.cliente_localidad_nombre
                    }
                },

                destinatario: {
                    id: row.destinatario_id,
                    nombre: row.destinatario_nombre,
                    apellido: row.destinatario_apellido,
                    direccion_local: row.destinatario_direccion,
                    telefono: row.destinatario_telefono,
                    email: row.destinatario_email,
                    localidad: { id: row.destinatario_localidad_id, nombre: row.destinatario_localidad_nombre }
                },

                chofer: row.chofer_id ? {
                    id: row.chofer_id,
                    nombre: row.chofer_nombre,
                    apellido: row.chofer_apellido,
                    telefono: row.chofer_telefono,
                    email: row.chofer_email
                } : null
            }));
        } catch (error) {
            console.error("Error en el metodo filtrarEncomiendas: ", error);
            throw error;
        }
    };

    /* async filtrarEncomiendas(filtros: { estado?: string, cliente_id?: number, chofer_id?: number }): Promise<IEncomiendaVista[]> {
        try {
            const baseQuery = `
      SELECT 
        e.id,
        e.tipo,
        e.estado,
        e.direccion_destino,
        e.fecha_creacion,
        e.descripcion,
        e.precio,

        -- CLIENTE
        c.id AS cliente_id,
        c.nombre AS cliente_nombre,
        c.apellido AS cliente_apellido,
        c.direccion_local AS cliente_direccion_local,
        c.telefono AS cliente_telefono,
        c.email AS cliente_email,
        lc.id AS cliente_localidad_id,
        lc.nombre AS cliente_localidad_nombre,

        -- CHOFER
        ch.id AS chofer_id,
        ch.nombre AS chofer_nombre,
        ch.apellido AS chofer_apellido,
        ch.telefono AS chofer_telefono,
        ch.email AS chofer_email,
        ch.destino_id AS chofer_destino_id,

        -- LOCALIDADES
        lo.id AS origen_id,
        lo.nombre AS origen_nombre,
        ld.id AS destino_id,
        ld.nombre AS destino_nombre

      FROM encomienda e
      JOIN cliente c ON e.cliente_id = c.id
      LEFT JOIN localidad lc ON c.id_localidad = lc.id
      LEFT JOIN chofer ch ON e.chofer_id = ch.id
      LEFT JOIN localidad lo ON e.origen_id = lo.id
      LEFT JOIN localidad ld ON e.destino_id = ld.id
    `;

            const conditions: string[] = [];
            const values: any[] = [];

            if (filtros.estado) {
                values.push(filtros.estado);
                conditions.push(`e.estado = $${values.length}`);
            }

            if (filtros.cliente_id) {
                values.push(filtros.cliente_id);
                conditions.push(`e.cliente_id = $${values.length}`);
            }

            if (filtros.chofer_id) {
                values.push(filtros.chofer_id);
                conditions.push(`e.chofer_id = $${values.length}`);
            }

            let query = baseQuery;
            if (conditions.length > 0) {
                query += ` WHERE ` + conditions.join(' AND ');
            }
            query += ' ORDER BY e.id DESC';

            const result = await pool.query(query, values);

            return result.rows.map(row => ({
                id: row.id,
                tipo: row.tipo,
                estado: row.estado,
                direccion_destino: row.direccion_destino,
                fecha_creacion: new Date(row.fecha_creacion),
                descripcion: row.descripcion,
                precio: parseFloat(row.precio),

                origen: {
                    id: row.origen_id,
                    nombre: row.origen_nombre
                },

                destino: {
                    id: row.destino_id,
                    nombre: row.destino_nombre
                },

                cliente: {
                    id: row.cliente_id,
                    nombre: row.cliente_nombre,
                    apellido: row.cliente_apellido,
                    direccion_local: row.cliente_direccion_local,
                    telefono: row.cliente_telefono,
                    email: row.cliente_email,
                    localidad: {
                        id: row.cliente_localidad_id,
                        nombre: row.cliente_localidad_nombre
                    }
                },

                chofer: row.chofer_id ? {
                    id: row.chofer_id,
                    nombre: row.chofer_nombre,
                    apellido: row.chofer_apellido,
                    telefono: row.chofer_telefono,
                    email: row.chofer_email
                } : null
            }));
        } catch (error) {
            console.error("Error en el método filtrarEncomiendas:", error);
            throw error;
        }
    }
 */

    /* async updateEncomienda(id: number, data: Partial<IEncomienda>): Promise<IEncomienda> {
        const camposSiemprePermitidos = [
            "estado",
            "tipo",
            "descripcion",
            "direccion_destino",
            "chofer_id",
            "cliente_destinatario_id",
            "fecha_creacion",
            "precio"
        ];

        const camposCondicionales = [
            "cliente_id",
            "origen",
            "destino",
            "descripcion"
        ];

        // Traemos la encomienda original
        const { rows } = await pool.query("SELECT * FROM encomienda WHERE id = $1", [id]);
        if (rows.length === 0) throw new Error("Encomienda no encontrada");

        const encomienda = rows[0];

        if (encomienda.estado === "Entregada") {
            throw new Error("No se puede modificar una encomienda entregada");
        }

        const camposFinales = [];
        const valores = [];
        let contador = 1;

        for (const [key, value] of Object.entries(data)) {
            if (camposSiemprePermitidos.includes(key)) {
                camposFinales.push(`${key} = $${contador}`);
                valores.push(value);
                contador++;
            } else if (camposCondicionales.includes(key)) {
                if (encomienda.estado === "Pendiente") {
                    camposFinales.push(`${key} = $${contador}`);
                    valores.push(value);
                    contador++;
                } else {
                    throw new Error(`El campo '${key}' solo puede modificarse si la encomienda está Pendiente`);
                }
            } else {
                throw new Error(`No está permitido actualizar el campo: '${key}'`);
            }
        }

        if (camposFinales.length === 0) {
            throw new Error("No se especificaron campos válidos para actualizar");
        }

        valores.push(id); // último valor para el WHERE
        const updateQuery = `
        UPDATE encomienda
        SET ${camposFinales.join(", ")}
        WHERE id = $${contador}
        RETURNING *
    `;

        const result = await pool.query(updateQuery, valores);
        return result.rows[0];
    } */
    async updateEncomienda(id: number, data: Partial<IEncomienda>): Promise<IEncomienda> {
        // 1️⃣ Traer la encomienda original
        const { rows } = await pool.query("SELECT * FROM encomienda WHERE id = $1", [id]);
        if (rows.length === 0) throw new Error("Encomienda no encontrada");

        const encomienda = rows[0];

        // 2️⃣ Si está entregada → no se puede modificar
        if (encomienda.estado === "Entregada") {
            throw new Error("No se puede modificar una encomienda que ya fue entregada");
        }

        // 3️⃣ No permitir update vacío
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No se enviaron campos para actualizar");
        }

        // 4️⃣ Construcción dinámica del UPDATE
        const campos = [];
        const valores = [];
        let idx = 1;

        for (const [key, value] of Object.entries(data)) {
            campos.push(`${key} = $${idx}`);
            valores.push(value);
            idx++;
        }

        valores.push(id);

        const updateQuery = `
        UPDATE encomienda
        SET ${campos.join(", ")}
        WHERE id = $${idx}
        RETURNING *
    `;

        const result = await pool.query(updateQuery, valores);
        return result.rows[0];
    }


    async existeEncomienda(id: number): Promise<boolean> {
        const result = await pool.query('SELECT 1 FROM encomienda WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return false; // No se encontró la encomienda para eliminar
        }
        return result.rows[0]; // Retorna la encomienda eliminada
    }

    async actualizarEstado(id: number, estado: string): Promise<void> {
        await pool.query(
            'UPDATE encomienda SET estado = $1 WHERE id = $2',
            [estado, id]
        );
    }


    async deleteEncomienda(id: number): Promise<IEncomienda | null> {
        try {
            const query = `
        DELETE FROM encomienda
        WHERE id = $1
        RETURNING *
        `;
            const result = await pool.query(query, [id]);
            if (result.rowCount === 0) {
                return null; // No se encontró la encomienda para eliminar
            }
            return result.rows[0]; // Retorna la encomienda eliminada
        } catch (error) {
            console.error("Error en el metodo deleteEncomienda: ", error);
            throw error;
        }
    };

    async getEncomiendasByCliente(clienteId: number): Promise<IEncomiendaVista[]> {
        try {
            const query = `
        SELECT
        e.id AS encomienda_id,
        e.tipo,
        e.estado,
        e.direccion_destino,
        e.fecha_creacion,
        e.descripcion,
        e.precio,

        -- Cliente remitente
        c.id AS cliente_id,
        c.nombre AS cliente_nombre,
        c.apellido AS cliente_apellido,
        c.direccion_local AS cliente_direccion,
        c.telefono AS cliente_telefono,
        c.email AS cliente_email,
        lc.id AS cliente_localidad_id,
        lc.nombre AS cliente_localidad_nombre,

        -- Cliente destinatario
        cd.id AS destinatario_id,
        cd.nombre AS destinatario_nombre,
        cd.apellido AS destinatario_apellido,
        cd.direccion_local AS destinatario_direccion,
        cd.telefono AS destinatario_telefono,
        cd.email AS destinatario_email,
        lcd.id AS destinatario_localidad_id,
        lcd.nombre AS destinatario_localidad_nombre,

        -- Chofer
        ch.id AS chofer_id,
        ch.nombre AS chofer_nombre,
        ch.apellido AS chofer_apellido,
        ch.telefono AS chofer_telefono,
        ch.email AS chofer_email,

        -- Origen y destino
        lo.id AS origen_id,
        lo.nombre AS origen_nombre,
        ld.id AS destino_id,
        ld.nombre AS destino_nombre

        FROM encomienda e
        LEFT JOIN cliente c ON e.cliente_id = c.id
        LEFT JOIN localidad lc ON c.id_localidad = lc.id
        LEFT JOIN cliente cd ON e.cliente_destinatario_id = cd.id
        LEFT JOIN localidad lcd ON cd.id_localidad = lcd.id
        LEFT JOIN chofer ch ON e.chofer_id = ch.id
        LEFT JOIN localidad lo ON e.origen_id = lo.id
        LEFT JOIN localidad ld ON e.destino_id = ld.id

        WHERE e.cliente_id = $1 OR e.cliente_destinatario_id = $1
        ORDER BY e.fecha_creacion DESC
        `;

            const { rows } = await pool.query(query, [clienteId]);

            return rows.map(row => ({
                id: row.encomienda_id,
                tipo: row.tipo,
                estado: row.estado,
                direccion_destino: row.direccion_destino,
                fecha_creacion: new Date(row.fecha_creacion),
                descripcion: row.descripcion,
                precio: parseFloat(row.precio),

                origen: {
                    id: row.origen_id,
                    nombre: row.origen_nombre
                },

                destino: {
                    id: row.destino_id,
                    nombre: row.destino_nombre
                },

                cliente: {
                    id: row.cliente_id,
                    nombre: row.cliente_nombre,
                    apellido: row.cliente_apellido,
                    direccion_local: row.cliente_direccion,
                    telefono: row.cliente_telefono,
                    email: row.cliente_email,
                    localidad: {
                        id: row.cliente_localidad_id,
                        nombre: row.cliente_localidad_nombre
                    }
                },

                destinatario: {
                    id: row.destinatario_id,
                    nombre: row.destinatario_nombre,
                    apellido: row.destinatario_apellido,
                    direccion_local: row.destinatario_direccion,
                    telefono: row.destinatario_telefono,
                    email: row.destinatario_email,
                    localidad: {
                        id: row.destinatario_localidad_id,
                        nombre: row.destinatario_localidad_nombre
                    }
                },

                chofer: row.chofer_id ? {
                    id: row.chofer_id,
                    nombre: row.chofer_nombre,
                    apellido: row.chofer_apellido,
                    telefono: row.chofer_telefono,
                    email: row.chofer_email
                } : null
            }));
        } catch (error) {
            console.error("Error en getEncomiendasByCliente:", error);
            throw error;
        }
    }

    async getEncomiendasByFecha(fecha: string): Promise<IEncomiendaVista[]> {
        const fechaNormalizada = new Date(fecha).toISOString().split("T")[0];
        const result = await pool.query(
            `SELECT * FROM encomienda
            WHERE fecha_creacion::date = $1
            ORDER BY id ASC`,
            [fechaNormalizada]
        )
        return result.rows
    }


};
export default new EncomiendaModel();