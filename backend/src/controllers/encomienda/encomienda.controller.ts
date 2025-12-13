import type { Request, Response } from "express";
import EncomiendaModel from "../../models/encomienda/encomiendaModel.ts";
import encomiendaModel from "../../models/encomienda/encomiendaModel.ts";
//import { IEncomiendaVista } from "../../interfaces/encomienda";

const ESTADOS_VALIDOS = ["Pendiente", "Entregada"];

export class EncomiendaController {
  async createEncomienda(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
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

      //  Traer la versión completa (con joins)
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

  // 🗑️ Eliminar una encomienda
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
      console.error("❌ Error al eliminar encomienda:", error);
      res.status(500).json({ message: "Error al eliminar la encomienda" });
    }
  }

  async getEncomiendasByCliente(req: Request, res: Response) {
    try {
      const clienteId = Number(req.params.id);

      if (isNaN(clienteId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const encomiendas = await encomiendaModel.getEncomiendasByCliente(clienteId);

      res.status(200).json(encomiendas);

    } catch (error) {
      console.error("Error en getEncomiendasByCliente:", error);
      res.status(500).json({ message: "Error al obtener encomiendas" });
    }
  }

  async getEncomiendasByFecha(req: Request, res: Response) {
    try {
      const fecha = req.query.fecha as string;
      if (!fecha) {
        return res.status(400).json({ message: "Fecha inválida" });
      }

      const encomiendas = await EncomiendaModel.getEncomiendasByFecha(fecha);

      res.status(200).json(encomiendas);
    } catch (error) {
      console.error("Error en getEncomiendasByFecha:", error);
      res.status(500).json({ message: "Error al obtener encomiendas" });
    }
  }
}


export default new EncomiendaController();
