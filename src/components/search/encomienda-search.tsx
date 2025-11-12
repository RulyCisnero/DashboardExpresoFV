"use client"

import { useState, useMemo } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Search, Eye, Calendar, MapPin } from "lucide-react"
import { getEstadoBadgeVariant } from "../../lib/utils-encomienda"
import type { Encomienda, EncomiendaFormData } from "../../types/encomienda"

interface EncomiendaSearchProps {
  //encomiendas: Encomienda[]
  encomiendas: EncomiendaFormData[]
  //onViewDetails: (encomienda: Encomienda) => void
  onViewDetails: (encomienda: EncomiendaFormData) => void
}

export function EncomiendaSearch({ encomiendas, onViewDetails }: EncomiendaSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("all")
  const [filterFecha, setFilterFecha] = useState("")

  const filteredEncomiendas = useMemo(() => {
    return encomiendas.filter((encomienda) => {
      const matchesSearch =
        //encomienda.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        encomienda.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        encomienda.destinatario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        encomienda.origen.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        encomienda.destino.nombre.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEstado = filterEstado === "all" || encomienda.estado === filterEstado

      const matchesFecha = !filterFecha || encomienda.fecha_creacion.toDateString() === filterFecha

      return matchesSearch && matchesEstado && matchesFecha
    })
  }, [encomiendas, searchTerm, filterEstado, filterFecha])

  return (
    <div className="space-y-6">
      {/* Filtros de búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscador de Encomiendas
          </CardTitle>
          <CardDescription>Busca encomiendas por código, remitente, destinatario o ruta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Búsqueda general</Label>
              <Input
                id="search"
                placeholder="Código, remitente, destinatario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="estado">Filtrar por estado</Label>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En tránsito">En tránsito</SelectItem>
                  <SelectItem value="Entregada">Entregada</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fecha">Filtrar por fecha de envío</Label>
              <Input
                id="fecha"
                type="date"
                value={filterFecha}
                onChange={(e) => setFilterFecha(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados de la búsqueda ({filteredEncomiendas.length} encontradas)</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEncomiendas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron encomiendas que coincidan con los criterios de búsqueda.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Remitente</TableHead>
                  <TableHead>Destinatario</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Envío</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEncomiendas.map((encomienda) => (
                  <TableRow key={encomienda.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">ENC-{encomienda.id}</TableCell>
                    <TableCell>{encomienda.cliente.nombre} {encomienda.cliente.apellido}</TableCell>
                    <TableCell>{encomienda.destinatario.nombre}   {encomienda.destinatario.apellido}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {encomienda.origen.nombre} → {encomienda.destino.nombre}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getEstadoBadgeVariant(encomienda.estado) as any}
                        className={
                          encomienda.estado === "Entregada" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""
                        }
                      >
                        {encomienda.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {/* {(encomienda.fecha_creacion).toLocaleDateString()} */}
                        {encomienda.fecha_creacion}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => onViewDetails(encomienda)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
