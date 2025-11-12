"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Menu, User, Truck, MapPin, History, Search, Plus, Users, Eye } from "lucide-react"
import { cn } from "../../lib/utils"

interface SidebarProps {
  onAddEncomienda: () => void
  onAddCliente: () => void
  onAddChofer: () => void
  onAddDestino: () => void
  onShowHistorial: () => void
  onShowBuscador: () => void
  onViewClientes: () => void
  onViewChoferes: () => void
  onViewDestinos: () => void
}

interface MenuItem {
  icon: any
  label: string
  onClick: () => void
  color: string
  separator?: never
}

interface MenuSeparator {
  separator: true
  icon?: never
  label?: never
  onClick?: never
  color?: never
}

type MenuItemType = MenuItem | MenuSeparator

export function Sidebar({
  onAddEncomienda,
  onAddCliente,
  onAddChofer,
  onAddDestino,
  onShowHistorial,
  onShowBuscador,
  onViewClientes,
  onViewChoferes,
  onViewDestinos,
}: SidebarProps) {
  const [open, setOpen] = useState(false)

  const menuItems: MenuItemType[] = [
    {
      icon: Search,
      label: "Buscador de Encomiendas",
      onClick: () => {
        onShowBuscador()
        setOpen(false)
      },
      color: "text-blue-600",
    },
    {
      icon: Plus,
      label: "Agregar Encomienda",
      onClick: () => {
        onAddEncomienda()
        setOpen(false)
      },
      color: "text-indigo-600",
    },
    {
      icon: User,
      label: "Agregar Cliente",
      onClick: () => {
        onAddCliente()
        setOpen(false)
      },
      color: "text-green-600",
    },
    {
      icon: Truck,
      label: "Agregar Chofer",
      onClick: () => {
        onAddChofer()
        setOpen(false)
      },
      color: "text-purple-600",
    },
    {
      icon: MapPin,
      label: "Agregar Destino",
      onClick: () => {
        onAddDestino()
        setOpen(false)
      },
      color: "text-orange-600",
    },
    {
      icon: History,
      label: "Historial de Encomiendas",
      onClick: () => {
        onShowHistorial()
        setOpen(false)
      },
      color: "text-gray-600",
    },
    // Separador visual
    { separator: true },
    {
      icon: Users,
      label: "Ver Todos los Clientes",
      onClick: () => {
        onViewClientes()
        setOpen(false)
      },
      color: "text-teal-600",
    },
    {
      icon: Truck,
      label: "Ver Todos los Choferes",
      onClick: () => {
        onViewChoferes()
        setOpen(false)
      },
      color: "text-violet-600",
    },
    {
      icon: Eye,
      label: "Ver Todos los Destinos",
      onClick: () => {
        onViewDestinos()
        setOpen(false)
      },
      color: "text-amber-600",
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Menú Principal</h2>
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                if (item.separator) {
                  return <div key={index} className="border-t border-gray-200 my-2" />
                }

                const Icon = item.icon
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className={cn("w-full justify-start gap-3 h-12", "hover:bg-gray-100 transition-colors")}
                    onClick={item.onClick}
                  >
                    <Icon className={cn("h-5 w-5", item.color)} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="mt-auto p-4 border-t">
            <div className="text-xs text-gray-500 text-center">Sistema de Gestión de Encomiendas v1.0</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Versión desktop del sidebar
export function DesktopSidebar({
  onAddEncomienda,
  onAddCliente,
  onAddChofer,
  onAddDestino,
  onShowHistorial,
  onShowBuscador,
  onViewClientes,
  onViewChoferes,
  onViewDestinos,
}: SidebarProps) {
  const menuItems: MenuItemType[] = [
    {
      icon: Search,
      label: "Buscador",
      onClick: onShowBuscador,
      color: "text-blue-600",
    },
    {
      icon: Plus,
      label: "Agregar Encomienda",
      onClick: onAddEncomienda,
      color: "text-indigo-600",
    },
    {
      icon: User,
      label: "Agregar Cliente",
      onClick: onAddCliente,
      color: "text-green-600",
    },
    {
      icon: Truck,
      label: "Agregar Chofer",
      onClick: onAddChofer,
      color: "text-purple-600",
    },
    {
      icon: MapPin,
      label: "Agregar Destino",
      onClick: onAddDestino,
      color: "text-orange-600",
    },
    {
      icon: History,
      label: "Historial",
      onClick: onShowHistorial,
      color: "text-gray-600",
    },
    // Separador
    { separator: true },
    {
      icon: Users,
      label: "Ver Clientes",
      onClick: onViewClientes,
      color: "text-teal-600",
    },
    {
      icon: Truck,
      label: "Ver Choferes",
      onClick: onViewChoferes,
      color: "text-violet-600",
    },
    {
      icon: Eye,
      label: "Ver Destinos",
      onClick: onViewDestinos,
      color: "text-amber-600",
    },
  ]

  return (
    <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h2 className="text-lg font-semibold text-gray-900">Menú Principal</h2>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {menuItems.map((item, index) => {
              if (item.separator) {
                return <div key={index} className="border-t border-gray-200 my-2" />
              }

              const Icon = item.icon
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn("w-full justify-start gap-3 h-12", "hover:bg-gray-100 transition-colors")}
                  onClick={item.onClick}
                >
                  <Icon className={cn("h-5 w-5", item.color)} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Button>
              )
            })}
          </nav>
        </div>

        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">Sistema de Gestión v1.0</div>
        </div>
      </div>
    </div>
  )
}
