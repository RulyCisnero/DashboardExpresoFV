import type { Request, Response } from 'express';
import { UsuarioModel } from '../../models/usuario/usuarioModel.ts';
import { bcryptUtils } from '../../utils/bcrypt.ts';
import { jwtUtils } from '../../utils/jwt.ts';
import type { IAuthResponse, ITokenPayload, IRefreshTokenPayload } from '../../interfaces/usuario.ts';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validar que email y password estén presentes
      if (!email || !password) {
        res.status(400).json({ error: 'Email y contraseña son requeridos' });
        return;
      }

      // Buscar usuario con password
      const usuario = await UsuarioModel.getUsuarioWithPasswordByEmail(email);
      console.log("Usuario encontrado:", usuario);
      if (!usuario) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }

      // Comparar contraseña
      const passwordValida = await bcryptUtils.comparePassword(password, usuario.password_hash);
      console.log("Password valida:", passwordValida);
      if (!passwordValida) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }

      // Generar tokens
      const tokenPayload: ITokenPayload = {
        id: usuario.id,
        email: usuario.email,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol,
        /* localidad_id: usuario.localidad_id, */
      };

      const refreshTokenPayload: IRefreshTokenPayload = {
        id: usuario.id,
        email: usuario.email,
      };

      const accessToken = jwtUtils.generateToken(tokenPayload);
      const refreshToken = jwtUtils.generateRefreshToken(refreshTokenPayload);

      // Actualizar última conexión
      await UsuarioModel.updateUltimaConexion(usuario.id);

      // Enviar refresh token en httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        path: '/api/auth',
      });

      // Respuesta con access token y datos del usuario
      const response: IAuthResponse = {
        token: accessToken,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol,
          /* localidad_id: usuario.localidad_id, */
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, nombre_usuario, nombre, apellido, password, rol_id, localidad_id } = req.body;

      // Validar campos requeridos
      if (!email || !nombre_usuario || !nombre || !apellido || !password || !rol_id) {
        res.status(400).json({
          error: 'Faltan campos requeridos: email, nombre_usuario, nombre, apellido, password, rol_id',
        });
        return;
      }

      // Validar que email no exista
      const emailExiste = await UsuarioModel.verificarEmailExiste(email);
      if (emailExiste) {
        res.status(400).json({ error: 'El email ya está registrado' });
        return;
      }

      // Validar que nombre_usuario no exista
      const usuarioExiste = await UsuarioModel.verificarUsuarioExiste(nombre_usuario);
      if (usuarioExiste) {
        res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
        return;
      }

      // Crear usuario
      const nuevoUsuario = await UsuarioModel.createUsuario({
        email,
        nombre_usuario,
        nombre,
        apellido,
        password,
        rol_id,
      });

      // Obtener rol
      const rol = await UsuarioModel.getRol(rol_id);

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        usuario: {
          id: nuevoUsuario.id,
          email: nuevoUsuario.email,
          nombre: nuevoUsuario.nombre,
          apellido: nuevoUsuario.apellido,
          rol: rol,
        },
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ error: 'Refresh token no encontrado' });
        return;
      }

      // Validar refresh token
      const decoded = jwtUtils.verifyRefreshToken(refreshToken);

      if (!decoded) {
        res.status(401).json({ error: 'Refresh token inválido o expirado' });
        return;
      }

      // Obtener usuario
      const usuario = await UsuarioModel.getUsuarioById(decoded.id);

      if (!usuario) {
        res.status(401).json({ error: 'Usuario no encontrado' });
        return;
      }

      // Generar nuevo access token
      const newTokenPayload: ITokenPayload = {
        id: usuario.id,
        email: usuario.email,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol,
      };

      const newAccessToken = jwtUtils.generateToken(newTokenPayload);

      res.status(200).json({
        token: newAccessToken,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol,
        },
      });
    } catch (error) {
      console.error('Error en refresh token:', error);
      res.status(500).json({ error: 'Error al refrescar token' });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // Limpiar cookie de refresh token
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth',
      });

      res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({ error: 'Error al cerrar sesión' });
    }
  }
}
