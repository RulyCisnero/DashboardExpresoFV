import { Router } from 'express';
import localidadRoutes from './localidad.routes.js';
import encomiendaRoutes from './encomienda.routes.js';
import choferRoutes from './chofer.routes.js';
import clienteRoutes from './cliente.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();
router.get('/', (req, res) => {
  res.json({ message: 'API funcionando' });
});

router.use('/auth', authRoutes);
router.use('/localidades', localidadRoutes);
router.use('/encomiendas', encomiendaRoutes);
router.use('/choferes', choferRoutes);
router.use('/clientes', clienteRoutes);

export default router;
