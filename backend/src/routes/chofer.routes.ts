import { Router } from "express";
import choferController from "../controllers/chofer/choferController.ts";
import { validarCamposChofer, validarIdParam, checkChoferExists } from "../middlewares/chofer/choferValidation.ts";
import { verificarToken, verificarRol } from "../middlewares/auth/authMiddleware.ts";

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verificarToken);

// GET - todos pueden consultar
router.get('/:id', choferController.getChoferById);
router.get('/', choferController.getAllChoferes);

// POST, PUT, DELETE - solo admin, personal y superUsuario
router.post('/', verificarRol(['superUsuario', 'administrador', 'personal']), choferController.createChofer);
router.put('/:id', verificarRol(['superUsuario', 'administrador', 'personal']), validarIdParam, validarCamposChofer, choferController.updateChofer);
router.delete('/:id', verificarRol(['superUsuario', 'administrador']), validarIdParam, checkChoferExists, choferController.deleteChofer);

export default router;