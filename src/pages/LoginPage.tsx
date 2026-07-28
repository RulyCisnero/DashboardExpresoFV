"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useToast } from "../components/ui/use-toast"
import { Package, User, Lock, EyeOff, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Redirect si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/"
    }
  }, [isAuthenticated])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.email || !formData.password) {
      setError("Email y contraseña son requeridos")
      return
    }

    try {
      await login(formData.email, formData.password)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión"
      setError(errorMessage)
    }
  }

  return (
    <div 
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat p-4 sm:p-8"
      style={{ backgroundImage: "url('/ExpresoLogin.png')" }} // Reemplaza con el nombre de tu imagen
    >
      {/* Capa de oscurecimiento muy sutil para asegurar que el texto blanco siempre se lea */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Contenedor principal que agrupa el texto y el form, evitando el scroll */}
      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center justify-between gap-12 md:flex-row md:gap-8 lg:px-12">
        
        {/* SECCIÓN IZQUIERDA: Textos adicionales */}
        <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left pt-8 md:pt-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white italic tracking-wider drop-shadow-xl">
            EXPRESO FV
          </h1>
          <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-[0.3em] text-white drop-shadow-md">
            COMISIONES
          </h2>
          <div className="my-6 h-1 w-16 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
          <p className="text-base sm:text-lg text-gray-100 drop-shadow-md">
            Rapidez, seguridad y confianza <br />
            <span className="text-red-500 font-bold">en cada envío.</span>
          </p>
        </div>

        {/* SECCIÓN DERECHA: Formulario de Login */}
        <div className="w-full max-w-md md:w-1/2">
          {/* Tarjeta con efecto Glassmorphism ajustada a la nueva imagen */}
          <div className="rounded-2xl border border-white/20 bg-[#0a1120]/60 p-6 sm:p-8 shadow-2xl backdrop-blur-md transition-all">
            
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 rounded-full border border-gray-500/50 bg-white/5 p-3 backdrop-blur-sm">
                <Package className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">Bienvenido</h2>
              <p className="mt-2 text-sm text-gray-300">
                Inicia sesión para continuar <br className="hidden sm:block" /> en el sistema de encomiendas.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-md bg-red-500/20 p-3 text-sm text-red-200 border border-red-500/50 text-center backdrop-blur-sm">
                  {error}
                </div>
              )}

              {/* Input Usuario */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Usuario"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="h-12 border-gray-600/50 bg-[#131e36]/60 pl-10 text-white placeholder:text-gray-400 focus-visible:ring-red-500 focus-visible:border-red-500 transition-colors"
                />
              </div>

              {/* Input Contraseña */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="h-12 border-gray-600/50 bg-[#131e36]/60 pl-10 pr-10 text-white placeholder:text-gray-400 focus-visible:ring-red-500 focus-visible:border-red-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                </button>
              </div>

              {/* Opciones extra */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-300 hover:text-white cursor-pointer transition-colors">
                  <input type="checkbox" className="mr-2 rounded border-gray-600 bg-transparent text-red-600 focus:ring-red-500" />
                  Recordarme
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <Button
                type="submit"
                className="h-12 w-full bg-[#E52B2B] text-white hover:bg-red-600 font-semibold text-md tracking-wide shadow-lg shadow-red-900/20 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "INICIAR SESIÓN"}
              </Button>
            </form>

            <div className="mt-8 flex items-center justify-center text-sm text-gray-400">
              <ShieldCheck className="mr-2 h-5 w-5 text-red-500" />
              <span>Sistema seguro y confiable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer reposicionado para no causar overflow */}
      <div className="absolute bottom-4 left-0 right-0 z-10 w-full text-center text-xs text-gray-400/80">
        © 2024 EXPRESO FV COMISIONES. Todos los derechos reservados.
      </div>
    </div>
  )
}
