import express from 'express';
import encomiendaController from '../controllers/encomienda/encomienda.controller.ts';
import { validarUpdateEncomienda, validarCamposEncomiendaPut } from '../middlewares/encomienda/validarUpdateEncomienda.ts';
import { validarCrearEncomienda } from '../middlewares/encomienda/validateEncomienda.ts';


const router = express.Router();

router.post('/',/* validarCrearEncomienda, */ encomiendaController.createEncomienda);
router.get('/:id', encomiendaController.getEncomiendaById);
router.get('/', encomiendaController.getAllEncomiendas);
router.get('/cliente', encomiendaController.FilteredEncomiendas);
router.put('/:id',validarCamposEncomiendaPut, encomiendaController.updateEncomienda);
router.put('/:id/estado', encomiendaController.updateEstado);
router.delete('/:id', encomiendaController.deleteEncomienda);

export default router;