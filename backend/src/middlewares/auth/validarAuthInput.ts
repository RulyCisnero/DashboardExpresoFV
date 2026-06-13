import type { Request, Response, NextFunction } from 'express';

export function validateLoginInput(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email es requerido y debe ser string' });
    return;
  }

  if (!password || typeof password !== 'string') {
    res.status(400).json({ error: 'Contraseña es requerida y debe ser string' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Contraseña debe tener al menos 6 caracteres' });
    return;
  }

  next();
}

export function validateRegisterInput(req: Request, res: Response, next: NextFunction): void {
  const { email, nombre_usuario, nombre, apellido, password, rol_id } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email es requerido y debe ser string' });
    return;
  }

  if (!nombre_usuario || typeof nombre_usuario !== 'string') {
    res.status(400).json({ error: 'Nombre de usuario es requerido y debe ser string' });
    return;
  }

  if (!nombre || typeof nombre !== 'string') {
    res.status(400).json({ error: 'Nombre es requerido y debe ser string' });
    return;
  }

  if (!apellido || typeof apellido !== 'string') {
    res.status(400).json({ error: 'Apellido es requerido y debe ser string' });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: 'Contraseña es requerida y debe tener al menos 6 caracteres' });
    return;
  }

  if (!rol_id || typeof rol_id !== 'number') {
    res.status(400).json({ error: 'Rol es requerido y debe ser número' });
    return;
  }

  next();
}
