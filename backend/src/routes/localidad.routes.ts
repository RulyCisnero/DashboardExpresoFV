import { Router } from "express";
import LocalidadController from "../controllers/localidad/localidad.controller.js";
import { validarLocalidad } from '../middlewares/localidad/validateLocalidad.js';
import { checkLocalidadExists, checkLocalidadNombreDuplicado } from '../middlewares/localidad/checkLocalidadExists.js';
import { validateLocalidadId } from '../middlewares/localidad/validateLocalidadId.js';
import { verificarToken, verificarRol } from '../middlewares/auth/authMiddleware.js';

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