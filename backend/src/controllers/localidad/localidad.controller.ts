import { Request, Response } from 'express';
import localidadModel from '../../models/localidad/localidadModel.ts';

export class LocalidadController {
    async getAllLocalidades(req: Request, res: Response): Promise<void> {
        try {
            const localidades = await localidadModel.getAllLocalidades();
            res.status(200).json(localidades);
        } catch (error) {
            console.error('Error al obtener localidades:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async getLocalidadById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const localidad = await localidadModel.getLocalidadById(id);
            if (!localidad) {
                res.status(404).json({ message: 'Localidad no encontrada' });
                return;
            }
            res.status(200).json(localidad);
        } catch (error) {
            console.error('Error al obtener localidad por ID:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async createLocalidad(req: Request, res: Response): Promise<void> {
        try {
            const { nombre } = req.body;
            if (!nombre?.trim()) {
                res.status(400).json({ message: 'El campo "nombre" es obligatorio' });
                return;
            }

            const nuevaLocalidad = await localidadModel.createLocalidad(nombre.trim());
            res.status(201).json(nuevaLocalidad);
        } catch (error) {
            console.error('Error al crear localidad: ', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async updateLocalidad(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }

            const { nombre } = req.body;
            if (!nombre?.trim()) {
                res.status(400).json({ message: 'El campo "nombre" es obligatorio' });
                return;
            }

            const update = await localidadModel.updateLocalidad(id, nombre.trim());
            if (update) {
                res.status(200).json({ message: 'Localidad actualizada correctamente' });
            } else {
                res.status(404).json({ message: 'Localidad no encontrada' });
            }
        } catch (error) {
            console.error('Error al actualizar localidad: ', error);
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }

    async deleteLocalidad(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }

            const deleted = await localidadModel.deleteLocalidad(id);
            if (!deleted) {
                res.status(404).json({ message: 'Localidad no encontrada' });
                return;
            }
            res.status(200).json({ message: 'Localidad eliminada correctamente' })
        } catch (error) {
            console.error('Error al eliminar localidad: ', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}
export default new LocalidadController();