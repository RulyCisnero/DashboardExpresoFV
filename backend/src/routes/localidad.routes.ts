import { Router } from "express";
import LocalidadController from "../controllers/localidad/localidad.controller.ts";
import { validarLocalidad } from '../middlewares/localidad/validateLocalidad.ts';
import { checkLocalidadExists, checkLocalidadNombreDuplicado } from '../middlewares/localidad/checkLocalidadExists.ts';
import { validateLocalidadId } from '../middlewares/localidad/validateLocalidadId.ts';
import { verificarToken, verificarRol } from '../middlewares/auth/authMiddleware.ts';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verificarToken);

// GET - todos pueden consultar
router.get('/', LocalidadController.getAllLocalidades);
router.get('/:id', validateLocalidadId, checkLocalidadExists, LocalidadController.getLocalidadById);

// POST, PUT, DELETE - solo admin y superUsuario (gestión de localidades)
router.post('/', verificarRol(['superUsuario', 'administrador']), validarLocalidad, checkLocalidadNombreDuplicado, LocalidadController.createLocalidad);
router.put('/:id', verificarRol(['superUsuario', 'administrador']), validateLocalidadId, checkLocalidadExists, validarLocalidad, checkLocalidadNombreDuplicado, LocalidadController.updateLocalidad);
router.delete('/:id', verificarRol(['superUsuario', 'administrador']), validateLocalidadId, checkLocalidadExists, LocalidadController.deleteLocalidad);

export default router;