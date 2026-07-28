import { AuthService } from "./auth.ts";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { skipAuth = false, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  // Agregar token si no es skipAuth
  if (!skipAuth) {
    const token = AuthService.getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Asegurar que siempre hay Content-Type
  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  let response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  // Si recibimos 401, intentar refrescar token
  if (response.status === 401 && !skipAuth) {
    try {
      const newTokenData = await AuthService.refreshToken();
      AuthService.setToken(newTokenData.token);
      AuthService.setUser(newTokenData.usuario);

      // Reintentar request original con nuevo token
      headers.set("Authorization", `Bearer ${newTokenData.token}`);
      response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: "include",
      });
    } catch (error) {
      // Si falla el refresh, logout y redirigir
      AuthService.clearStorage();
      window.location.href = "/";
      throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.");
    }
  }

  return response;
}
