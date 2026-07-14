import express from 'express';
import encomiendaController from '../controllers/encomienda/encomienda.controller.js';
import { validarUpdateEncomienda, validarCamposEncomiendaPut } from '../middlewares/encomienda/validarUpdateEncomienda.js';
import { validarCrearEncomienda } from '../middlewares/encomienda/validateEncomienda.js';
import { verificarToken, verificarRol, /* verificarLocalidadChofer */ validarAccesoLocalidad } from '../middlewares/auth/authMiddleware.js';

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(verificarToken);
/* router.use(verificarLocalidadChofer); */

// Rutas específicas con palabra fija
router.get("/fecha", encomiendaController.getEncomiendasByFecha);
router.get("/cliente", encomiendaController.FilteredEncomiendas);
//router.get("/chofer/:id", encomiendaController.getEncomiendasByChofer);
//router.get("/chofer/:id/hoy",verificarRol(['chofer']),encomiendaController.getEncomiendasByChoferHoy);
router.get("/chofer/:id/hoy", (req, res) => {

    console.log("ENTRO AL ENDPOINT HOY")
    
    res.json({
        mensaje: "funciona",
        id: req.params.id
    })

})
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