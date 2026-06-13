import express from 'express';
import encomiendaController from '../controllers/encomienda/encomienda.controller.ts';
import { validarUpdateEncomienda, validarCamposEncomiendaPut } from '../middlewares/encomienda/validarUpdateEncomienda.ts';
import { validarCrearEncomienda } from '../middlewares/encomienda/validateEncomienda.ts';
import { verificarToken, verificarRol, /* verificarLocalidadChofer */ validarAccesoLocalidad } from '../middlewares/auth/authMiddleware.ts';

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(verificarToken);
/* router.use(verificarLocalidadChofer); */

// Rutas específicas con palabra fija
router.get("/fecha", encomiendaController.getEncomiendasByFecha);
router.get("/cliente", encomiendaController.FilteredEncomiendas);

// Rutas con parámetros
router.get("/cliente/:id", encomiendaController.getEncomiendasByCliente);
router.get("/:id", encomiendaController.getEncomiendaById);

// Ruta general (siempre al final)
router.get("/", encomiendaController.getAllEncomiendas);

// Otros métodos - requieren permisos específicos
router.post("/", verificarRol(['superUsuario', 'administrador', 'personal']), encomiendaController.createEncomienda);
router.put("/:id", verificarRol(['superUsuario', 'administrador', 'personal']), validarAccesoLocalidad, encomiendaController.updateEncomienda);
router.put('/:id/estado', verificarRol(['superUsuario', 'administrador', 'personal', 'chofer']), validarAccesoLocalidad, encomiendaController.updateEstado);
router.delete("/:id", verificarRol(['superUsuario', 'administrador']), encomiendaController.deleteEncomienda);

export default router;