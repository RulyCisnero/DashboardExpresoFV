"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { History, Calendar, TrendingUp, Package, CheckCircle } from "lucide-react"
import { getEstadoBadgeVariant, getEstadoStats } from "../../lib/utils-encomienda"
import type {EncomiendaRich } from "../../types/encomienda"


interface EncomiendaHistoryProps {
  encomiendas: EncomiendaRich[]
}

export function EncomiendaHistory({ encomiendas }: EncomiendaHistoryProps) {
  const [filterPeriod, setFilterPeriod] = useState("all")

  const filteredEncomiendas = useMemo(() => {
    if (filterPeriod === "all") return encomiendas

    const now = new Date()
    const filterDate = new Date()

    switch (filterPeriod) {
      case "today":
        filterDate.setHours(0, 0, 0, 0)
        break
      case "week":
        filterDate.setDate(now.getDate() - 7)
        break
      case "month":
        filterDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return encomiendas
    }

    return encomiendas.filter((enc) => new Date(enc.fecha_creacion) >= filterDate)
  }, [encomiendas, filterPeriod])

  const stats = getEstadoStats(filteredEncomiendas)
  /* if (encomiendas.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <CardTitle className="mb-2">No hay encomiendas registradas</CardTitle>
          <CardDescription>Comienza creando tu primera encomienda usando el botón "Nueva Encomienda"</CardDescription>
        </CardContent>
      </Card>
    )
  } */

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historial de Encomiendas
              </CardTitle>
              <CardDescription>Registro completo de todas las encomiendas del sistema</CardDescription>
            </div>
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el historial</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
                <SelectItem value="year">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Estadísticas del período */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">En Tránsito</p>
                <p className="text-2xl font-bold text-orange-600">{stats.enTransito}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Entregadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.entregadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-purple-600">{stats.pendientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de historial */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Encomiendas ({filteredEncomiendas.length} registros)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Fecha Envío</TableHead>
                <TableHead>Remitente</TableHead>
                <TableHead>Destinatario</TableHead>
                <TableHead>Ruta</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Precio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEncomiendas
                .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
                .map((encomienda) => (
                  <TableRow key={encomienda.id}>
                    <TableCell className="font-medium">ENC-{encomienda.id}</TableCell>
                    <TableCell>{new Date(encomienda.fecha_creacion).toLocaleDateString()}</TableCell>
                    <TableCell>{encomienda.cliente.nombre} {encomienda.cliente.apellido}</TableCell>
                    <TableCell>{encomienda.destinatario.nombre} {encomienda.destinatario.apellido}</TableCell>
                    <TableCell className="text-sm">
                      {encomienda.origen.nombre} → {encomienda.destino.nombre}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getEstadoBadgeVariant(encomienda.estado) as any}
                        className={
                          encomienda.estado === "Entregada" ? "bg-green-100 text-green-800 hover:bg-green-300" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-300"
                        }
                      >
                        {encomienda.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">${encomienda.precio}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
