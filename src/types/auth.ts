export type UserRole = "superUsuario" | "administrador" | "personal" | "chofer";

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  localidad_id?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  usuario: User;
}
