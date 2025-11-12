"use client"
import { useState } from "react" //Eliminar luego
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { Users, Phone, Mail, MapPin, Edit, Trash2 } from "lucide-react"
import type { Cliente, ClienteFormData, ClienteFormInput } from "../../types/encomienda"
import { useCliente } from "../../services/hooks-services/use-cliente"
import { DeleteClienteModal } from "../modals/delete-cliente-modal"
import { EditClienteModal } from "../modals/edit-cliente-modal"

interface ClientesViewProps {
  clientes: Cliente[]
}

export function ClientesView({ clientes = [] }: ClientesViewProps) {
  const [searchTerm, setSearchTerm] = useState("")//eliminar luego

  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const {
    deleteCliente,
    updateCliente
  } = useCliente()

  const handleDeleteClick = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setIsDeleteOpen(true)
  }

  const handleEditClick = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setEditModalOpen(true)
  }

  const handleUpdate = async (id: number, data: ClienteFormInput) => {
    await updateCliente(id, data)
    /* setSelectedLocalidad(prev =>
      prev.map(loc => (loc.id === id ? updated : loc))
    ) */
    setEditModalOpen(false)
  }


  const handleConfirmDelete = async () => {
    if (selectedCliente) {
      await deleteCliente(selectedCliente)
      setIsDeleteOpen(false)
      setSelectedCliente(null)
    }
  }

  // Filtrado simple (case-insensitive)
  const filteredClientes = clientes.filter((cliente) => {
    const term = searchTerm.toLowerCase()
    return (
      cliente.nombre.toLowerCase().includes(term) ||
      cliente.apellido.toLowerCase().includes(term) ||
      cliente.telefono.toLowerCase().includes(term) ||
      cliente.email.toLowerCase().includes(term)
    )
  })


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Todos los Clientes
          </CardTitle>
          <CardDescription>Lista completa de clientes registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Búsqueda Cliente</Label>
              <Input
                id="search"
                placeholder="Nombre, Apellido, Telefono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
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
                <TableHead>Dirección Local</TableHead>
                <TableHead>Localidad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">#{cliente.id}</TableCell>
                  <TableCell className="font-medium">{cliente.nombre} {cliente.apellido}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {cliente.telefono}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {cliente.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{cliente.direccion_local}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{cliente.localidad.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4"
                          onClick={() => handleEditClick(cliente)} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4"
                          onClick={() => handleDeleteClick(cliente)} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {clientes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No hay clientes registrados en el sistema.</p>
          </CardContent>
        </Card>
      )}

      {filteredClientes.length === 0 && clientes.length > 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No se encontraron coincidencias para "{searchTerm}"
        </div>
      )}

      <DeleteClienteModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        cliente={selectedCliente ?? undefined}
        onConfirm={handleConfirmDelete}
      />

      <EditClienteModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        cliente={selectedCliente || undefined}
        onSubmit={handleUpdate}
      />

    </div>
  )
}
