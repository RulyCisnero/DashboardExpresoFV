import type { LoginRequest, AuthResponse, User } from "../types/auth.ts";

const API_URL = "http://localhost:5100/api/auth";

export const AuthService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Login fallido");
    }

    return res.json();
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem("token");
    if (token) {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
    }
  },

  async refreshToken(): Promise<{ token: string; usuario: User }> {
    const res = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Refresh token inválido o expirado");
    }

    return res.json();
  },

  getStoredToken(): string | null {
    return localStorage.getItem("token");
  },

  getStoredUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  clearStorage(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  setToken(token: string): void {
    localStorage.setItem("token", token);
  },

  setUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  },
};
