import { Router } from 'express';
import clienteController from '../controllers/cliente/clienteController.ts';
import { validateCreateCliente, validateIdParam, validateSearchCliente } from '../middlewares/cliente/clienteValidations.ts';
import { verificarToken, verificarRol } from '../middlewares/auth/authMiddleware.ts';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verificarToken);

// GET - todos pueden consultar
router.get('/buscar', clienteController.searchCliente);
router.get('/:id', validateIdParam, clienteController.getClienteById);
router.get('/', clienteController.getAllClientes);

// POST, PUT, DELETE - solo admin, personal y superUsuario
router.post('/', verificarRol(['superUsuario', 'administrador', 'personal']), validateCreateCliente, clienteController.createCliente);
router.put('/:id', verificarRol(['superUsuario', 'administrador', 'personal']), validateIdParam, validateCreateCliente, clienteController.updateCliente);
router.delete('/:id', verificarRol(['superUsuario', 'administrador']), validateIdParam, clienteController.deleteCliente);

export default router;