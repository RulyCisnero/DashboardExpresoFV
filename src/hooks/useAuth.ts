import { useState, useCallback, useContext } from "react";
import { AuthService } from "../services/auth.ts";
import { User, UserRole } from "../types/auth.ts";
import { AuthContext } from "../context/AuthContext.tsx";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }

  return context;
};
