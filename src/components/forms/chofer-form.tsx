"use client"

import type React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import type { ChoferFormData } from "../../types/encomienda"

interface ChoferFormProps {
  onSubmit: (data: ChoferFormData) => void
  onCancel: () => void
  textoActual?: ChoferFormData
}

export function ChoferForm({ onSubmit, onCancel, textoActual }: ChoferFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data: ChoferFormData = {
      nombre: formData.get("nombre") as string,
      apellido: formData.get("apellido") as string,
      telefono: formData.get("telefono") as string,
      email: formData.get("email") as string,
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" defaultValue={textoActual?.nombre} required />
        </div>
        <div>
          <Label htmlFor="apellido">Apellido</Label>
          <Input id="apellido" name="apellido" defaultValue={textoActual?.apellido} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={textoActual?.email} required />
        </div>
        <div>
          <Label htmlFor="telefono">Número de Telefono</Label>
          <Input id="telefono" name="telefono" placeholder="ej: 2921999999" defaultValue={textoActual?.telefono} required />
        </div>
      </div>

      {/* <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehiculo">Vehículo</Label>
          <Input id="vehiculo" name="vehiculo" placeholder="ej: Ford Transit - ABC123" required />
        </div>
        <div>
          <Label htmlFor="estado">Estado</Label>
          <Select name="estado" required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Agregar Chofer</Button>
      </div>
    </form>
  )
}
