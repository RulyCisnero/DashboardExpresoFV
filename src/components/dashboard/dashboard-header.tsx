"use client"
import { UserMenu } from "../layout/user-menu"
import { Menu } from "lucide-react"
import { Button } from "../ui/button"

interface DashboardHeaderProps {
  /*  localidades: Localidad[]
   selectedLocalidad: Localidad | "Todas"
   onLocalidadChange: (value: Localidad | "Todas") => void; */
  onOpenMenu: () => void
}

export function DashboardHeader({ /* localidades, selectedLocalidad, onLocalidadChange */onOpenMenu }: DashboardHeaderProps) {

  return (
    <header className=" flex  items-center justify-between p-4">
      <div className="flex items-center gap-3">

        <Button
          className="md:hidden text-white bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30rounded-lg"
          variant="ghost"
          onClick={onOpenMenu}
        > 
          <Menu />
         </Button> 


        <div>
          <h1 className="text-xl font-bold">
            Sistema de Encomiendas
          </h1>

          <p className="text-muted-foreground text-sm">
            Gestiona y rastrea todas las encomiendas
          </p>

        </div>

      </div>


      <UserMenu />


    </header >
  )

}
