"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { MapPin, Edit, Trash2 } from "lucide-react"

import type { Localidad, LocalidadFormData } from "../../types/encomienda"
import { DeleteLocalidadModal } from "../modals/delete-localidad-modal"
import { EditDestinoModal } from "../modals/edit-destino-modal"

interface DestinosViewProps {
  localidades: Localidad[]
  onAddClick: () => void
  onEditLocalidad: (id: number, data: LocalidadFormData) => void
  onDeleteLocalidad: (localidad: Localidad) => Promise<void>
  loading: boolean
  error: string | null
}

export function DestinosView({ localidades, onDeleteLocalidad, onEditLocalidad, loading, error }: DestinosViewProps) {
  const [selectedLocalidad, setSelectedLocalidad] = useState<Localidad | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleDeleteClick = (localidad: Localidad) => {
    setSelectedLocalidad(localidad)
    setIsDeleteOpen(true)
  }

  const handleEditClick = (localidad: Localidad) => {
    console.log("click en el boton")
    setSelectedLocalidad(localidad)
    setEditModalOpen(true)
  }

  const handleUpdate = async (id: number, data: LocalidadFormData) => {
    await onEditLocalidad(id, data)
    setEditModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (selectedLocalidad) {
      await onDeleteLocalidad(selectedLocalidad)
      setIsDeleteOpen(false)
      setSelectedLocalidad(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Todos los Destinos
          </CardTitle>
          <CardDescription>Lista completa de destinos registrados en el sistema</CardDescription>
          <MapPin> asd </MapPin>
          
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localidades.map((localidad) => (
                <TableRow key={localidad.id}>
                  <TableCell className="font-medium">#{localidad.id}</TableCell>
                  <TableCell className="font-medium">{localidad.nombre}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(localidad)}>
                        <Edit className="h-4 w-4"
                        />
                      </Button>
                      <Button variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(localidad)}>
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {localidades.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No hay destinos registrados en el sistema.</p>
          </CardContent>
        </Card>
      )}

      <DeleteLocalidadModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        localidad={selectedLocalidad ?? undefined}
        onConfirm={handleConfirmDelete}
      />

      <EditDestinoModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        localidad={selectedLocalidad || undefined}
        onSubmit={handleUpdate}
      />
    </div>
  )
}

