import express from 'express';
import encomiendaController from '../controllers/encomienda/encomienda.controller.ts';
import { validarUpdateEncomienda, validarCamposEncomiendaPut } from '../middlewares/encomienda/validarUpdateEncomienda.ts';
import { validarCrearEncomienda } from '../middlewares/encomienda/validateEncomienda.ts';


const router = express.Router();

//router.post('/',/* validarCrearEncomienda, */ encomiendaController.createEncomienda);
//router.get('/:id', encomiendaController.getEncomiendaById);
//router.get('/', encomiendaController.getAllEncomiendas);
//router.get('/cliente', encomiendaController.FilteredEncomiendas);
//router.get("/cliente/:id", encomiendaController.getEncomiendasByCliente);
//router.get("/fecha",encomiendaController.getEncomiendasByFecha);
//router.put('/:id',/* validarCamposEncomiendaPut , */encomiendaController.updateEncomienda);
//router.put('/:id/estado', encomiendaController.updateEstado);
//router.delete('/:id', encomiendaController.deleteEncomienda);
// 1) Rutas específicas con palabra fija
router.get("/fecha", encomiendaController.getEncomiendasByFecha);
router.get("/cliente", encomiendaController.FilteredEncomiendas);

// 2) Rutas con parámetros
router.get("/cliente/:id", encomiendaController.getEncomiendasByCliente);
router.get("/:id", encomiendaController.getEncomiendaById);

// 3) Ruta general (siempre al final)
router.get("/", encomiendaController.getAllEncomiendas);

// Otros métodos
router.post("/", encomiendaController.createEncomienda);
router.put("/:id", encomiendaController.updateEncomienda);
router.put('/:id/estado', encomiendaController.updateEstado);
router.delete("/:id", encomiendaController.deleteEncomienda);

export default router;