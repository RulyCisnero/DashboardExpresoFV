import { Router } from 'express';
import { AuthController } from '../controllers/auth/authController.ts';
import { validateLoginInput, validateRegisterInput } from '../middlewares/auth/validarAuthInput.ts';
import { verificarToken, verificarRol } from '../middlewares/auth/authMiddleware.ts';

const router = Router();

// POST /api/auth/login - Sin protección
router.post('/login', validateLoginInput, async (req, res) => {
  await AuthController.login(req, res);
});

// POST /api/auth/register - Solo superUsuario
router.post('/register', verificarToken, verificarRol(['superUsuario']), validateRegisterInput, async (req, res) => {
  await AuthController.register(req, res);
});

// POST /api/auth/refresh - Sin protección, valida refreshToken en cookie
router.post('/refresh', async (req, res) => {
  await AuthController.refreshToken(req, res);
});

// POST /api/auth/logout - Protegido
router.post('/logout', verificarToken, async (req, res) => {
  await AuthController.logout(req, res);
});

export default router;
