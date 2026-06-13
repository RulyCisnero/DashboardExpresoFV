import type { Request, Response, NextFunction } from 'express';
import { jwtUtils } from '../../utils/jwt.ts';
import type { Rol, ITokenPayload } from '../../interfaces/usuario.ts';

// Extender Request para agregar propiedades de usuario
declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
      localidadFiltro?: number;
    }
  }
}

export async function verificarToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    console.log("Header auth:", req.headers.authorization);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token no proporcionado' });
      return;
    }

    const token = authHeader.substring(7); // Remover "Bearer "
    console.log("Token recibido:", token);
    const decoded = jwtUtils.verifyToken(token);

    if (!decoded) {
      res.status(401).json({ error: 'Token inválido o expirado' });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({ error: 'Error al verificar token' });
  }
}

export function verificarRol(rolesPermitidos: Rol[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (!rolesPermitidos.includes(req.user.rol as Rol)) {
      res.status(403).json({ error: 'Acceso denegado: permisos insuficientes' });
      return;
    }

    next();
  };
}

/* export function verificarLocalidadChofer(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }

  // Si es chofer, agregar filtro de localidad
  if (req.user.rol === 'chofer' && req.user.localidad_id) {
    req.localidadFiltro = req.user.localidad_id;
  }

  next();
} */

export function validarAccesoLocalidad(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }

 /*  // Si es chofer, validar que no intente acceder a otra localidad
  if (req.user.rol === 'chofer' && req.user.localidad_id) {
    const localidadParam = req.query.localidad_id || req.body?.localidad_id;

    if (localidadParam && Number(localidadParam) !== req.user.localidad_id) {
      res.status(403).json({ error: 'Acceso denegado: no tienes permiso para acceder a esta localidad' });
      return;
    }
  }

  next(); */
}
