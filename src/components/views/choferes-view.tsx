"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
//import { Badge } from "../ui/badge"
import { Truck, Phone, Mail,/*  CreditCard, */ Edit, Trash2 } from "lucide-react"
import type { Chofer, ChoferFormData } from "../../types/encomienda"
import { DeleteChoferModal } from "../modals/delete-chofer-modal"
import { useChoferes } from "../../services/hooks-services/use-choferes"
import { EditChoferModal } from "../modals/edit-chofer-modal"

interface ChoferesViewProps {
  choferes: Chofer[]
  onDeleteChofer?: (id: number) => void
}

export function ChoferesView({ choferes = [], onDeleteChofer }: ChoferesViewProps) {
  const [selectedChofer, setSelectedChofer] = useState<Chofer | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const {
    deleteChofer,
    updateChofer
  } = useChoferes()

  const handleDeleteClick = (chofer: Chofer) => {
    setSelectedChofer(chofer)
    setIsDeleteOpen(true)
  }
  const handleEditClick = (chofer: Chofer) => {
    setSelectedChofer(chofer)
    setEditModalOpen(true)
  }

  const handleUpdate = async (id: number, data: ChoferFormData) => {
    await updateChofer(id, data)
    /* setSelectedLocalidad(prev =>
      prev.map(loc => (loc.id === id ? updated : loc))
    ) */
    setEditModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (selectedChofer) {
      await deleteChofer(selectedChofer)
      setIsDeleteOpen(false)
      setSelectedChofer(null)
    }
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Todos los Choferes
          </CardTitle>
          <CardDescription>Lista completa de choferes registrados en el sistema</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre y Apellido</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {choferes.map((chofer) => (
                <TableRow key={chofer.id}>
                  <TableCell className="font-medium">#{chofer.id}</TableCell>
                  <TableCell className="font-medium">{chofer.nombre} {chofer.apellido}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {chofer.telefono}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {chofer.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(chofer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteClick(chofer)}>
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

      {choferes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No hay choferes registrados en el sistema.</p>
          </CardContent>
        </Card>
      )}

      <DeleteChoferModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        chofer={selectedChofer ?? undefined}
        onConfirm={handleConfirmDelete}
      />

      <EditChoferModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        chofer={selectedChofer || undefined}
        onSubmit={handleUpdate}
      />

    </div>
  )
}
