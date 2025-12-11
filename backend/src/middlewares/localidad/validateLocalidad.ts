//import type { Request, Response, NextFunction } from "express";
import * as express from "express";



/**
 * Valida el cuerpo del request para asegurar que el campo 'nombre' esté presente,
 * sea una cadena de texto y no esté vacío.
 */
/* export function validateLocalidadData(req: Request, res: Response, next: express.NextFunction): Response | void {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la localidad es obligatorio y debe ser una cadena válida.' });
  }

  next();
} */

export function validarLocalidad  (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
)  {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== "string") {
    return res.status(400).json({ error: "Nombre inválido" });
  }

  next();
};








