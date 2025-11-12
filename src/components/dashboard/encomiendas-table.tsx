"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
//import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Eye, Edit, Trash2, ArrowUpDown, Package, /* Calendar,  MapPin */ } from "lucide-react"
//import { getEstadoColor } from "../../lib/utils-encomienda"
import { getEstadoBadgeVariant } from "../../lib/utils-encomienda"
import type { Encomienda, EncomiendaFormData, EncomiendaTable } from "../../types/encomienda"
//import { TableContent } from "../ui/table" // Import TableContent 

interface EncomiendasTableProps {
  //encomiendas: Encomienda[]
  /*   onViewDetails: (encomienda: Encomienda) => void
    onEdit: (encomienda: Encomienda) => void
    onDelete: (id: number) => void */
  encomiendasData: EncomiendaTable[]
  onViewDetails: (encomienda: EncomiendaTable) => void
  onEdit: (encomienda: EncomiendaTable) => void
  onDelete: (id: number) => void
}

type SortField = keyof EncomiendaTable/* Encomienda */
type SortDirection = "asc" | "desc"

export function EncomiendasTable({ encomiendasData, onViewDetails, onEdit, onDelete }: EncomiendasTableProps) {
  const [sortField, setSortField] = useState<SortField>("fecha_creacion")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedEncomiendas = [...encomiendasData].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  if (encomiendasData.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <CardTitle className="mb-2">No hay encomiendas registradas</CardTitle>
          <CardDescription>Comienza creando tu primera encomienda usando el botón "Nueva Encomienda"</CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Encomiendas ({encomiendasData.length} registros)</CardTitle>
      </CardHeader>
      {/* <TableContent> */}
      {" "}
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-2">
                    Código
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("cliente")}>
                  <div className="flex items-center gap-2">
                    Remitente
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("destinatario")}>
                  <div className="flex items-center gap-2">
                    Destinatario
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Origen → Destino</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("estado")}>
                  <div className="flex items-center gap-2">
                    Estado
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("fecha_creacion")}>
                  <div className="flex items-center gap-2">
                    Fecha Envío
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEncomiendas.map((encomienda) => (
                <TableRow
                  key={encomienda.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onViewDetails(encomienda)}
                >
                  <TableCell className="font-medium">ENC-{encomienda.id}</TableCell>
                  <TableCell>{encomienda.cliente.nombre} {encomienda.cliente.apellido}</TableCell>
                  <TableCell>{encomienda.destinatario.nombre} {encomienda.destinatario.apellido}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{encomienda.origen.nombre}</div>
                      <div className="text-muted-foreground">↓</div>
                      <div>{encomienda.destino.nombre}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {/*  <Badge className={getEstadoColor(encomienda.estado)}>{encomienda.estado}</Badge>  */}
                    <Badge
                      variant={getEstadoBadgeVariant(encomienda.estado) as any}
                      className={
                        encomienda.estado === "Entregada" ? "bg-green-100 text-green-800 hover:bg-green-300" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-300"
                      }
                    >
                      {encomienda.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(encomienda.fecha_creacion).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">${encomienda.precio}</TableCell>
                  <TableCell>
                  
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(encomienda)}
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(encomienda)} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(encomienda.id)}
                        title="Eliminar"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* </TableContent> */}
      </CardContent>
    </Card>
  )
}
