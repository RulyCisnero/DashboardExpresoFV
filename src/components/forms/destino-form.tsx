"use client"

import type React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
//import { Checkbox } from "../ui/checkbox"
//import { Textarea } from "../ui/textarea"
import type { LocalidadFormData } from "../../types/encomienda"

interface DestinoFormProps {
  onSubmit: (data: LocalidadFormData) => void
  onCancel: () => void
  textoActual?:LocalidadFormData
}

export function DestinoForm({ onSubmit, onCancel, textoActual }: DestinoFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data: LocalidadFormData = {
      nombre: formData.get("nombre") as string,
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre del Destino</Label>
          <Input id="nombre" name="nombre" placeholder="ej: Coronel Dorrego" defaultValue={textoActual?.nombre} required />
        </div>
        {/* <div>
          <Label htmlFor="provincia">Provincia/Estado</Label>
          <Input id="provincia" name="provincia" placeholder="ej: Buenos Aires" required />
        </div> */}
      </div>

      {/* 
      <div>
        <Label htmlFor="direccion">Dirección específica</Label>
        <Textarea id="direccion" name="direccion" placeholder="ej: Terminal de Retiro, Av. Ramos Mejía 1302" required />
      </div>
      */}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Agregar Destino</Button>
      </div>
    </form>
  )
}
