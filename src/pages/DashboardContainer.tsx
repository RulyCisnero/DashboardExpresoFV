//única responsabilidad es decidir qué dashboard mostrar.
"use client"

import { useAuth } from "../hooks/useAuth"

import Dashboard from "./Dashboard"
import ChoferDashboard from "./ChoferDashboard"


export default function DashboardContainer() {


  const { usuario } = useAuth()


  // mientras carga el usuario
  if (!usuario) {

    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando usuario...
      </div>
    )

  }



  switch(usuario.rol){

    case "chofer":
      return <ChoferDashboard />

    case "superUsuario":
    case "administrador":
    case "personal":
      return <Dashboard />

    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          Rol no autorizado
        </div>
      )

  }

}