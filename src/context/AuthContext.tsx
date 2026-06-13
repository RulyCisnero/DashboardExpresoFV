import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User, UserRole } from "../types/auth.ts";
import { AuthService } from "../services/auth.ts";
import { useToast } from "../components/ui/use-toast.ts";

export interface AuthContextType {
  usuario: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkRol: (rolesPermitidos: UserRole[]) => boolean;
  isChofer: boolean;
  isAdmin: boolean;
  refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Validar sesión al montar
  useEffect(() => {
    const validarSesion = async () => {
      setIsLoading(true);
      try {
        const storedToken = AuthService.getStoredToken();
        const storedUser = AuthService.getStoredUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUsuario(storedUser);
        }
      } catch (err) {
        console.error("Error validando sesión:", err);
        AuthService.clearStorage();
      } finally {
        setIsLoading(false);
      }
    };

    validarSesion();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(email, password);

      AuthService.setToken(response.token);
      AuthService.setUser(response.usuario);

      setToken(response.token);
      setUsuario(response.usuario);

      toast({
        title: "Éxito",
        description: "Sesión iniciada correctamente",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      AuthService.clearStorage();
      setToken(null);
      setUsuario(null);
      setError(null);

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (err) {
      console.error("Error en logout:", err);
      AuthService.clearStorage();
      setToken(null);
      setUsuario(null);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await AuthService.refreshToken();
      AuthService.setToken(response.token);
      setToken(response.token);
    } catch (err) {
      console.error("Error refrescando token:", err);
      await logout();
    }
  }, [logout]);

  const checkRol = useCallback(
    (rolesPermitidos: UserRole[]): boolean => {
      if (!usuario) return false;
      return rolesPermitidos.includes(usuario.rol);
    },
    [usuario]
  );

  const isChofer = usuario?.rol === "chofer";
  const isAdmin = usuario?.rol === "administrador" || usuario?.rol === "superUsuario";
  const isAuthenticated = !!token && !!usuario;

  const value: AuthContextType = {
    usuario,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkRol,
    isChofer,
    isAdmin,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
