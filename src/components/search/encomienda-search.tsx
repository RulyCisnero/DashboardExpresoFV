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
  encomiendasData?: EncomiendaRich[] // opcional por compatibilidad, usamos el hook de cliente
  onViewDetails: (encomienda: EncomiendaRich) => void
}

export function EncomiendaSearch({ onViewDetails }: EncomiendaSearchProps) {
  // filtros y texto libre para filtrar resultados ya cargados
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("all")
  const [filterFecha, setFilterFecha] = useState("")

  // input visible donde el usuario escribe el nombre/dni/etc del cliente
  const [query, setQuery] = useState("")

  // debounce state
  const [debouncedQuery, setDebouncedQuery] = useState("")

  // bandera local para saber si el usuario seleccionó un cliente concreto:
  // cuando existe, evitamos re-disparar la búsqueda automática por debounce hasta que cambie el texto
  const [selectedClienteName, setSelectedClienteName] = useState<string | null>(null)

  // hooks que ya tenés
  const {
    cliente,
    clientesEncontrados,
    loadingBuscar,
    errorBuscar,
    searchCliente
  } = useBuscarCliente()

  const {
    encomiendas,
    loading: loadingEncs,
    error: errorEncs,
    loadByCliente
  } = useEncomiendasPorCliente()

  // Debounce: cuando el usuario deja de tipear durante 400ms, actualiza debouncedQuery
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400)
    return () => clearTimeout(t)
  }, [query])

  // Cuando cambia debouncedQuery buscamos clientes (solo si tiene >= 2 caracteres)
  useEffect(() => {
    const q = debouncedQuery.trim()
    if (q.length < 2) return

    // si ya hay un cliente seleccionado y el query coincide con su nombre completo,
    // no hacemos la búsqueda (evita repetir la misma request al elegir cliente)
    if (selectedClienteName && q === selectedClienteName) return

    // llamamos al hook que realiza la petición
    // no await aquí: searchCliente ya maneja loading y errores
    searchCliente(q)
      .catch(() => {
        /* si hay error, el hook lo guarda en errorBuscar -> lo mostramos en UI */
      })
  }, [debouncedQuery, selectedClienteName, searchCliente])

  // Si el usuario edita el campo después de haber seleccionado un cliente,
  // reseteamos la selección para poder buscar otra vez.
  useEffect(() => {
    if (selectedClienteName && query !== selectedClienteName) {
      setSelectedClienteName(null)
    }
  }, [query, selectedClienteName])

  // Handler cuando el usuario elige un cliente del dropdown
  const handleSelectCliente = async (c: { id: number; nombre: string; apellido: string }) => {
    const fullName = `${c.nombre} ${c.apellido}`
    setQuery(fullName)                 // mostrar nombre en el input
    setSelectedClienteName(fullName)   // bloquear el re-search por debounce mientras coincida
    // cargar encomiendas del cliente
    try {
      await loadByCliente(c.id)
    } catch (e) {
      // loadByCliente ya maneja error en su hook; aquí podemos loguear si querés
      console.error("Error cargando encomiendas por cliente:", e)
    }
  }

  // Filtro local sobre las encomiendas cargadas
  const filteredEncomiendas = useMemo(() => {
    return encomiendas.filter((encomienda) => {
      const q = searchTerm.trim().toLowerCase()
      const matchesSearch =
        (!q) ||
        (encomienda.cliente?.nombre?.toLowerCase().includes(q)) ||
        (encomienda.cliente?.apellido?.toLowerCase().includes(q)) ||
        (encomienda.destinatario?.nombre?.toLowerCase().includes(q)) ||
        (encomienda.destinatario?.apellido?.toLowerCase().includes(q)) ||
        (encomienda.origen?.nombre?.toLowerCase().includes(q)) ||
        (encomienda.destino?.nombre?.toLowerCase().includes(q))

      const matchesEstado = filterEstado === "all" || encomienda.estado === filterEstado
      const matchesFecha = !filterFecha || (formatDate(encomienda.fecha_creacion) === filterFecha)

      return matchesSearch && matchesEstado && matchesFecha
    })
  }, [encomiendas, searchTerm, filterEstado, filterFecha])

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda de cliente (input con dropdown resultados) */}
            <div className="relative">
              <Label htmlFor="search">Búsqueda general (cliente)</Label>
              <Input
                id="search"
                placeholder="Nombre, apellido o documento..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mt-1"
              />

              {/* Dropdown: solo se muestra si escribiste algo y no hay cliente seleccionado */}
              {query.length > 0 && !selectedClienteName && (
                <div className="absolute z-50 w-full bg-white shadow-lg border rounded-md mt-1 max-h-60 overflow-auto">
                  {/* Cargando */}
                  {loadingBuscar && <p className="p-3 text-sm text-gray-500">Buscando...</p>}

                  {/* Si NO hay resultados y hubo intento de búsqueda */}
                  {!loadingBuscar && !cliente && clientesEncontrados.length === 0 && errorBuscar && (
                    <div className="text-center py-4 text-gray-500">
                      <Search className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                      <p>No se encontraron clientes que coincidan con la búsqueda.</p>
                    </div>
                  )}

                  {/* Si hay coincidencias múltiples */}
                  {!loadingBuscar && clientesEncontrados.length > 0 && clientesEncontrados.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelectCliente(c)}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {c.nombre} {c.apellido} {c.localidad ? `— ${c.localidad.nombre}` : ""}
                    </div>
                  ))}

                  {/* Si hay un único cliente (el hook lo deja en cliente) */}
                  {!loadingBuscar && cliente && (
                    <div
                      onClick={() => handleSelectCliente(cliente)}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
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
        </CardContent>
      </Card>

      {/* Resultados: si no hay encomiendas cargadas (array vacío) se muestra mensaje */}
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
