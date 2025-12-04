"use client"

import { useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Search, Eye, Calendar, MapPin } from "lucide-react"
import { getEstadoBadgeVariant } from "../../lib/utils-encomienda"
import type { EncomiendaFormData, EncomiendaView } from "../../types/encomienda"
import { useBuscarCliente } from "../../services/hooks-services/use-buscarCliente"
import { useEncomiendasPorCliente } from "../../services/hooks-services/use.-encomiendasPorCliente"

interface EncomiendaSearchProps {
  onViewDetails: (encomienda: EncomiendaView[]) => void
}

export function EncomiendaSearch2({ onViewDetails }: EncomiendaSearchProps) {
  const [query, setQuery] = useState("")

  // Hook para buscar cliente
  const {
    cliente,
    loadingBuscar,
    errorBuscar,
    searchCliente
  } = useBuscarCliente()

  // Hook para traer encomiendas del cliente
  const {
    encomiendas,
    loading,
    error,
    loadByCliente
  } = useEncomiendasPorCliente()

  const handleSearch = async () => {
    if (!query.trim()) return

    try {
      // 1) Buscar cliente
      const result = await searchCliente(query)

      // 2) Buscar encomiendas del cliente
      if (result?.id) {
        await loadByCliente(result.id)
      }
    } catch (e) {
      console.error("Error en búsqueda:", e)
    }
  }

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Encomiendas por Cliente
          </CardTitle>
          <CardDescription>Buscá por nombre, apellido o DNI</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label>Cliente</Label>
              <Input
                placeholder="Ej: Raul, Pérez, 12345678..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button className="w-full" onClick={handleSearch} disabled={loadingBuscar}>
                {loadingBuscar ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </div>

          {/* Estado de búsqueda */}
          {errorBuscar && <p className="text-red-500 mt-2">{errorBuscar}</p>}
          {cliente && (
            <p className="mt-2 text-sm text-green-600">
              Cliente encontrado: <strong>{cliente.nombre} {cliente.apellido}</strong>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
          <CardDescription>
            {loading ? "Cargando encomiendas..." : `Encontradas: ${encomiendas.length}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!loading && encomiendas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay encomiendas para este cliente.</p>
            </div>
          )}

          {encomiendas.length > 0 && (
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
                {encomiendas.map((enc) => (
                  <TableRow key={enc.id}>
                    <TableCell>ENC-{enc.id}</TableCell>
                    <TableCell>{enc.cliente_id/* .nombre */} {/* {enc.cliente.apellido} */}</TableCell>
                    <TableCell>{enc.cliente_destinatario_id/*.nombre */} {/* {enc.destinatario.apellido} */}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {enc.origen_id/* .nombre */} → {enc.destino_id/* .nombre */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEstadoBadgeVariant(enc.estado)}>
                        {enc.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Calendar className="h-3 w-3 mr-1" />
                      {enc.fecha_creacion}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => onViewDetails(enc)}>
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
