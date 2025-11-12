import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Package, Clock, CheckCircle } from "lucide-react"
import type { Encomienda } from "../../types/encomienda"

interface StatsCardsProps {
  encomiendas: Encomienda[]
}

export function StatsCards({ encomiendas }: StatsCardsProps) {
  const stats = {
    total: encomiendas.length,
    pendientes: encomiendas.filter((e) => e.estado === "Pendiente").length,
    enTransito: encomiendas.filter((e) => e.estado === "En tránsito").length,
    entregadas: encomiendas.filter((e) => e.estado === "Entregada").length,
    canceladas: encomiendas.filter((e) => e.estado === "Cancelado").length,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Encomiendas</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Todas las encomiendas registradas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
          <p className="text-xs text-muted-foreground">Esperando ser procesadas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En Tránsito</CardTitle>
          <Package className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.enTransito}</div>
          <p className="text-xs text-muted-foreground">En camino al destino</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entregadas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.entregadas}</div>
          <p className="text-xs text-muted-foreground">Completadas exitosamente</p>
        </CardContent>
      </Card>
    </div>
  )
}
