"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Search, Eye, Calendar, MapPin } from "lucide-react"
import { formatDate, getEstadoBadgeVariant } from "../../lib/utils-encomienda"
import type { EncomiendaRich } from "../../types/encomienda"
import { useBuscarCliente } from "../../services/hooks-services/use-buscarCliente"
import { useEncomiendasPorCliente } from "../../services/hooks-services/use.-encomiendasPorCliente"

interface EncomiendaSearchProps {
  encomiendasData?: EncomiendaRich[]
  onViewDetails: (encomienda: EncomiendaRich) => void
}

export function EncomiendaSearch({ encomiendasData = [], onViewDetails }: EncomiendaSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("all")
  const [filterFecha, setFilterFecha] = useState("")
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedCliente, setSelectedCliente] = useState<{ id: number; nombre: string; apellido: string } | null>(null)

  const {
    cliente,
    clientesEncontrados,
    loadingBuscar,
    errorBuscar,
    searchCliente
  } = useBuscarCliente()

  const {
    encomiendas: encomiendasPorCliente,
    loading: loadingEncs,
    error: errorEncs,
    loadByCliente
  } = useEncomiendasPorCliente()

  const baseEncomiendas = useMemo(() => {
    const source = encomiendasData.length > 0 ? encomiendasData : encomiendasPorCliente
    return [...source].sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
  }, [encomiendasData, encomiendasPorCliente])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const q = debouncedQuery.trim()

    if (q.length < 2) {
      setSelectedCliente(null)
      return
    }

    if (selectedCliente && q === `${selectedCliente.nombre} ${selectedCliente.apellido}`) {
      return
    }

    setSelectedCliente(null)
    searchCliente(q).catch(() => {
      // El error se maneja dentro del hook
    })
  }, [debouncedQuery, searchCliente, selectedCliente])

  const handleSelectCliente = async (c: { id: number; nombre: string; apellido: string }) => {
    const fullName = `${c.nombre} ${c.apellido}`
    setSelectedCliente(c)
    setQuery(fullName)

    try {
      await loadByCliente(c.id)
    } catch (e) {
      console.error("Error cargando encomiendas por cliente:", e)
    }
  }

  const filteredEncomiendas = useMemo(() => {
    const results = selectedCliente ? baseEncomiendas : []

    return results.filter((encomienda) => {
      const q = searchTerm.trim().toLowerCase()
      const searchableText = [
        encomienda.cliente?.nombre,
        encomienda.cliente?.apellido,
        encomienda.destinatario?.nombre,
        encomienda.destinatario?.apellido,
        encomienda.origen?.nombre,
        encomienda.destino?.nombre,
        encomienda.direccion_destino,
        encomienda.descripcion,
        encomienda.estado,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      const matchesSearch = !q || searchableText.includes(q)
      const matchesEstado = filterEstado === "all" || encomienda.estado === filterEstado
      const matchesFecha = !filterFecha || formatDate(encomienda.fecha_creacion) === filterFecha

      return matchesSearch && matchesEstado && matchesFecha
    })
  }, [baseEncomiendas, filterEstado, filterFecha, searchTerm, selectedCliente])

  const clienteSeleccionadoNombre = selectedCliente ? `${selectedCliente.nombre} ${selectedCliente.apellido}` : ""
  const clienteNoEncontrado = query.trim().length >= 2 && !loadingBuscar && !selectedCliente && !cliente && clientesEncontrados.length === 0 && !errorEncs
  const clienteSinEncomiendas = !!selectedCliente && !loadingEncs && filteredEncomiendas.length === 0
  const hayBusquedaActiva = query.trim().length >= 2

  return (
    <div className="space-y-6">
      {/* Filtros de búsqueda / input cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscador de Encomiendas
          </CardTitle>
          <CardDescription>Busca encomiendas por cliente (nombre/apellido), remitente, destinatario o ruta</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            {/* Búsqueda de cliente (input con dropdown resultados) */}
            <div className="relative">
              <Label htmlFor="search">Búsqueda general (cliente)</Label>
              <Input
                id="search"
                placeholder="Buscar cliente por nombre o apellido..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mt-1"
              />

              {query.length > 0 && !selectedCliente && (
                <div className="absolute z-50 w-full bg-popover shadow-lg border rounded-md mt-1 max-h-60 overflow-auto">
                  {loadingBuscar && <p className="p-3 text-sm text-white">Buscando cliente...</p>}

                  {!loadingBuscar && !cliente && clientesEncontrados.length === 0 && (
                    <div className="text-center py-4 px-3 text-sm text-white">
                      <Search className="h-5 w-5 mx-auto mb-2 text-white" />
                      <p>No se encontró ningún cliente con ese nombre.</p>
                    </div>
                  )}

                  {!loadingBuscar && clientesEncontrados.length > 0 && clientesEncontrados.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelectCliente(c)}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-600 text-white border-b border-white/10 last:border-b-0"
                    >
                      {c.nombre} {c.apellido} {c.localidad ? `— ${c.localidad.nombre}` : ""}
                    </div>
                  ))}

                  {!loadingBuscar && cliente && (
                    <div
                      onClick={() => handleSelectCliente(cliente)}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-600 text-white"
                    >
                      {cliente.nombre} {cliente.apellido} {cliente.localidad ? `— ${cliente.localidad.nombre}` : ""}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filtrar por estado */}
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

            {/* Filtrar por fecha */}
            <div>
              <Label htmlFor="fecha_creacion">Filtrar por fecha de envío</Label>
              <Input
                id="fecha_creacion"
                type="date"
                value={filterFecha}
                onChange={(e) => setFilterFecha(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {(searchTerm || filterEstado !== "all" || filterFecha) && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setFilterEstado("all")
                  setFilterFecha("")
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {!hayBusquedaActiva && (
            <div className="text-center py-8 text-gray-100">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-100" />
              <p>Escribí el nombre del cliente para ver sus encomiendas.</p>
            </div>
          )}

          {hayBusquedaActiva && clienteNoEncontrado && (
            <div className="text-center py-8 text-gray-100">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-100" />
              <p>No se encontraron encomiendas para ese cliente.</p>
            </div>
          )}

          {clienteSinEncomiendas && (
            <div className="text-center py-8 text-gray-100">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-100" />
              <p>{clienteSeleccionadoNombre} no tiene encomiendas registradas.</p>
            </div>
          )}

          {!clienteNoEncontrado && !clienteSinEncomiendas && filteredEncomiendas.length > 0 && (
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
                  <TableRow key={encomienda.id} className="hover:bg-gray-600">
                    <TableCell className="font-medium">ENC-{encomienda.id}</TableCell>
                    <TableCell>{encomienda.cliente?.nombre} {encomienda.cliente?.apellido}</TableCell>
                    <TableCell>{encomienda.destinatario?.nombre ?? "-"} {encomienda.destinatario?.apellido ?? ""}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {encomienda.origen?.nombre} → {encomienda.destino?.nombre}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEstadoBadgeVariant(encomienda.estado) as any}>
                        {encomienda.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(encomienda.fecha_creacion)}
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
