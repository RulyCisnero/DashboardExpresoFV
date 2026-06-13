export interface IUsuario {
  id: number;
  email: string;
  nombre_usuario: string;
  nombre: string;
  apellido: string;
  rol_id: number;
  activo: boolean;
  fecha_creacion?: string;
  ultima_conexion?: string;
}

export interface IUsuarioLogin {
  email: string;
  password: string;
}

export interface ITokenPayload {
  id: number;
  email: string;
  nombre_usuario: string;
  rol: string;
  iat?: number;
  exp?: number;
}

export interface IRefreshTokenPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface IAuthResponse {
  token: string;
  usuario: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
  };
}

export type Rol = "superUsuario" | "administrador" | "personal" | "chofer";
