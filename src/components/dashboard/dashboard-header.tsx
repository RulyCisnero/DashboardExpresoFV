"use client"
import { UserMenu } from "../layout/user-menu"

interface DashboardHeaderProps {
  /*  localidades: Localidad[]
   selectedLocalidad: Localidad | "Todas"
   onLocalidadChange: (value: Localidad | "Todas") => void; */
}

export function DashboardHeader({ /* localidades, selectedLocalidad, onLocalidadChange */ }: DashboardHeaderProps) {

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sistema de Encomiendas</h1>
        <p className="text-muted-foreground">Gestiona y rastrea todas las encomiendas de tu empresa</p>
      </div>
      <div className="flex flex-wrap gap-2">
      </div>
      {/* Separador visual */}
      <div className="hidden md:block w-px h-6 bg-border mx-2" />

      {/* Menú de usuario */}
      <UserMenu />

    </div>
  )
}
