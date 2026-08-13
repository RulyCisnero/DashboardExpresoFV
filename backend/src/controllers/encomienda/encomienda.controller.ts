import type { Request, Response } from "express";
import EncomiendaModel from "../../models/encomienda/encomiendaModel.js";
import choferModel from "../../models/chofer/choferModel.js";
import { UsuarioModel } from "../../models/usuario/usuarioModel.ts";

const ESTADOS_VALIDOS = ["Pendiente", "Entregada"];

export class EncomiendaController {
  async createEncomienda(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      // Si no se especificó fecha_entrega, por compatibilidad usar la fecha_creacion (solo fecha)
      if (!data.fecha_entrega && data.fecha_creacion) {
        const d = new Date(data.fecha_creacion);
        data.fecha_entrega = isNaN(d.getTime()) ? undefined : d.toISOString().split('T')[0];
      }
      const nueva = await EncomiendaModel.createEncomienda(data);
      res.status(201).json(nueva);
    } catch (error) {
      console.error(" Error al crear encomienda:", error);
      res.status(500).json({ message: "Error al crear la encomienda" });
    }
  }

  async getEncomiendaById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const encomienda = await EncomiendaModel.getEncomiendaById(id);

      if (!encomienda) {
        res.status(404).json({ message: "Encomienda no encontrada" });
        return;
      }

      res.status(200).json(encomienda);
    } catch (error) {
      console.error("Error al obtener encomienda:", error);
      res.status(500).json({ message: "Error al obtener la encomienda" });
    }
  }

  async getAllEncomiendas(req: Request, res: Response): Promise<void> {
    try {
      const encomiendas = await EncomiendaModel.getAllEncomiendas();
      res.status(200).json(encomiendas);
    } catch (error) {
      console.error("❌ Error al obtener encomiendas:", error);
      res.status(500).json({ message: "Error al obtener las encomiendas" });
    }
  }

  //  Filtrar encomiendas (por estado, cliente, chofer)
  async FilteredEncomiendas(req: Request, res: Response): Promise<void> {
    try {
      const filtros = {
        estado: req.query.estado as string,
        cliente_id: req.query.cliente_id ? parseInt(req.query.cliente_id as string) : undefined,
        chofer_id: req.query.chofer_id ? parseInt(req.query.chofer_id as string) : undefined,
      };

      const encomiendas = await EncomiendaModel.filtrarEncomiendas(filtros);
      res.status(200).json(encomiendas);
    } catch (error) {
      console.error("❌ Error al filtrar encomiendas:", error);
      res.status(500).json({ message: "Error al filtrar las encomiendas" });
    }
  }

  async updateEncomienda(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;

      const actualizada = await EncomiendaModel.updateEncomienda(id, data);
      if (!actualizada) {
        res.status(404).json({ message: "Encomienda no encontrada" });
        return;
      }

      const completa = await EncomiendaModel.getEncomiendaById(id);
      res.status(200).json(completa || actualizada);
    } catch (error: any) {
      if (error.code === "23503") {
        res.status(400).json({ error: "Referencia inválida (cliente o chofer inexistente)." });
        return;
      }
      console.error("Error al actualizar encomienda:", error);
      res.status(400).json({ error: "No se pudo actualizar la encomienda." });
    }
  }

  //  Actualizar solo el estado de la encomienda
  async updateEstado(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { estado, ...rest } = req.body;

      if (!estado || Object.keys(rest).length > 0) {
        res.status(400).json({ error: 'Solo se permite modificar el campo "estado".' });
        return;
      }

      if (!ESTADOS_VALIDOS.includes(estado)) {
        res.status(400).json({ error: 'Estado no válido. Use "Pendiente" o "Entregada".' });
        return;
      }

      const existe = await EncomiendaModel.existeEncomienda(id);
      if (!existe) {
        res.status(404).json({ error: "Encomienda no encontrada." });
        return;
      }

      await EncomiendaModel.actualizarEstado(id, estado);
      res.status(200).json({ mensaje: "Estado actualizado correctamente." });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  async deleteEncomienda(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const eliminada = await EncomiendaModel.deleteEncomienda(id);

      if (!eliminada) {
        res.status(404).json({ message: "Encomienda no encontrada" });
        return;
      }

      res.status(200).json(eliminada);
    } catch (error) {
      console.error(" Error al eliminar encomienda:", error);
      res.status(500).json({ message: "Error al eliminar la encomienda" });
    }
  }

  async getEncomiendasByCliente(req: Request, res: Response) {
    try {
      const clienteId = Number(req.params.id);

      if (isNaN(clienteId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const encomiendas = await EncomiendaModel.getEncomiendasByCliente(clienteId);

      res.status(200).json(encomiendas);

    } catch (error) {
      console.error("Error en getEncomiendasByCliente:", error);
      res.status(500).json({ message: "Error al obtener encomiendas" });
    }
  }

  /* async getEncomiendasByFecha(req: Request, res: Response) {
    try {
      const fechaParam = req.query.fecha;
      const fecha = typeof fechaParam === 'string'
        ? fechaParam.trim() || new Date().toISOString().split('T')[0]
        : Array.isArray(fechaParam)
          ? (fechaParam[0] || '').trim() || new Date().toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
      const fechaObj = new Date(fecha);

      if (isNaN(fechaObj.getTime())) {
        return res.status(400).json({ message: "Fecha inválida" });
      }

      let choferId: number | undefined;
      let localidadId: number | undefined;

      const localidadParam = Array.isArray(req.query.localidad_id)
        ? req.query.localidad_id[0]
        : typeof req.query.localidad_id === "string"
          ? req.query.localidad_id
          : undefined;

      if (localidadParam) {
        localidadId = Number(localidadParam);
        if (isNaN(localidadId)) {
          return res.status(400).json({ message: "Localidad inválida" });
        }
      }

      if (req.user?.rol === "chofer") {
        const userEmail = req.user.email;
        const userNombre = req.user.nombre;
        const userApellido = req.user.apellido;

        if (userEmail) {
          const choferRec = await choferModel.getChoferByEmail(userEmail);
          if (choferRec) {
            choferId = choferRec.id;
          }
        }

        if (!choferId && userNombre && userApellido) {
          const choferRec = await choferModel.getChoferByNombreApellido(userNombre, userApellido);
          if (choferRec) {
            choferId = choferRec.id;
          }
        }

        if (!choferId) {
          return res.status(200).json([]);
        }
      } else {
        const choferIdParam = Array.isArray(req.query.chofer_id)
          ? req.query.chofer_id[0]
          : typeof req.query.chofer_id === "string"
            ? req.query.chofer_id
            : undefined;

        if (choferIdParam) {
          choferId = Number(choferIdParam);
          if (isNaN(choferId)) {
            return res.status(400).json({ message: "Chofer inválido" });
          }
        }
      }

      const encomiendas = await EncomiendaModel.getEncomiendasByFecha(fecha, choferId, localidadId);

      res.status(200).json(encomiendas);
    } catch (error) {
      console.error("Error en getEncomiendasByFecha:", error);
      res.status(500).json({ message: "Error al obtener encomiendas" });
    }
  } */

  async getEncomiendasByFecha(req: Request, res: Response) {
    try {
      // 1. Extraer la fecha garantizando a TypeScript que es un string
      let fechaStr = '';
      if (typeof req.query.fecha === 'string') {
        fechaStr = req.query.fecha;
      } else if (Array.isArray(req.query.fecha) && typeof req.query.fecha[0] === 'string') {
        fechaStr = req.query.fecha[0];
      }

      // Ahora TypeScript sabe que fechaStr es 100% string, .trim() no fallará
      const fecha = fechaStr.trim() || new Date().toISOString().split('T')[0];
      const fechaObj = new Date(fecha);

      if (isNaN(fechaObj.getTime())) {
        return res.status(400).json({ message: "Fecha inválida" });
      }

      let choferId: number | undefined;
      let localidadId: number | undefined;

      // 2. Extraer localidad_id de forma segura
      const locQuery = req.query.localidad_id;
      const localidadParam = Array.isArray(locQuery) ? locQuery[0] : locQuery;

      if (typeof localidadParam === 'string') {
        localidadId = Number(localidadParam);
        if (isNaN(localidadId)) {
          return res.status(400).json({ message: "Localidad inválida" });
        }
      }

      // 3. Validaciones de rol
      if (req.user?.rol === "chofer") {
        const userEmail = req.user.email;
        const userNombre = req.user.nombre;
        const userApellido = req.user.apellido;

        if (userEmail) {
          const choferRec = await choferModel.getChoferByEmail(userEmail);
          if (choferRec) {
            choferId = choferRec.id;
          }
        }

        if (!choferId && userNombre && userApellido) {
          const choferRec = await choferModel.getChoferByNombreApellido(userNombre, userApellido);
          if (choferRec) {
            choferId = choferRec.id;
          }
        }

        if (!choferId) {
          return res.status(200).json([]);
        }
      } else {
        // 4. Extraer chofer_id de forma segura
        const choferQuery = req.query.chofer_id;
        const choferIdParam = Array.isArray(choferQuery) ? choferQuery[0] : choferQuery;

        if (typeof choferIdParam === 'string') {
          choferId = Number(choferIdParam);
          if (isNaN(choferId)) {
            return res.status(400).json({ message: "Chofer inválido" });
          }
        }
      }

      const encomiendas = await EncomiendaModel.getEncomiendasByFecha(fecha, choferId, localidadId);

      res.status(200).json(encomiendas);
    } catch (error) {
      console.error("Error en getEncomiendasByFecha:", error);
      res.status(500).json({ message: "Error al obtener encomiendas" });
    }
  }


  async getEncomiendasByChofer(req: Request, res: Response) {
    try {
      const choferId = Number(req.params.id)

      if (isNaN(choferId)) {
        res.status(400).json({ message: "ID inválido" })
        return
      }

      const encomiendas = await EncomiendaModel.getEncomiendasByChofer(choferId)
      res.status(200).json(encomiendas)

    } catch (error) {
      console.error("Error al obtener encomiendas del chofer:", error)
      res.status(500).json({ message: "Error interno" })
    }
  }

  async getEncomiendasByChoferHoy(req: Request, res: Response) {
    try {
      let choferId = Number(req.params.id)

      if (req.user?.rol === "chofer") {
        const userEmail = req.user.email
        const choferRec = userEmail ? await choferModel.getChoferByEmail(userEmail) : null
        if (choferRec) {
          choferId = choferRec.id
        }
      }

      if (isNaN(choferId)) {
        res.status(400).json({ message: "ID inválido" })
        return
      }

      const encomiendas = await EncomiendaModel.getEncomiendasByChoferHoy(choferId)
      res.status(200).json(encomiendas)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Error al obtener encomiendas del chofer" })
    }
  }

}
export default new EncomiendaController();
