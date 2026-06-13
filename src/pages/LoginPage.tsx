"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { useToast } from "../components/ui/use-toast"

export default function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
            <p className="font-semibold mb-2">Usuarios de Prueba:</p>
            <p>SuperUsuario: admin@test.com</p>
            <p>Admin: admin@test.com</p>
            <p>Personal: personal@test.com</p>
            <p>Chofer: chofer@test.com</p>
            <p className="mt-2">Contraseña: password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
