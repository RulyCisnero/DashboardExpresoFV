"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import type { ClienteFormInput, Localidad } from "../../types/encomienda"

interface ClienteFormProps {
  onSubmit: (data: ClienteFormInput) => void
  onCancel: () => void
  localidades: Localidad[]
  loadingLocalidades?: boolean
  initialData?: Partial<ClienteFormInput>
}

export function ClienteForm({ onSubmit, onCancel, initialData, localidades, loadingLocalidades }: ClienteFormProps) {

  const [formData, setFormData] = useState<ClienteFormInput>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion_local: "",
    id_localidad: 0,
  });

  // Cuando llega initialData, actualizá el estado:
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        apellido: initialData.apellido || "",
        telefono: initialData.telefono || "",
        email: initialData.email || "",
        direccion_local: initialData.direccion_local || "",
        id_localidad: initialData.id_localidad || 0,
      });
    }
  }, [initialData]);


  /* const [localidades, setLocalidades] = useState<Localidad[]>([])
  // Cargo localidades para  montar el nombre de localidad en listbox
  useEffect(() => {
    async function fetchLocalidades() {
      try {
        const res = await fetch("http://localhost:5100/api/localidades");
        const data: Localidad[] = await res.json();
        setLocalidades(data);
      } catch (error) {
        console.error("Error al cargar localidades:", error);
      }
    }
    fetchLocalidades();
  }, []);
 */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof ClienteFormInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleInputChange("nombre", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido *</Label>
          <Input
            id="apellido"
            value={formData.apellido}
            onChange={(e) => handleInputChange("apellido", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            type="tel"
            value={formData.telefono}
            onChange={(e) => handleInputChange("telefono", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion_local">Dirección *</Label>
          <Input
            id="direccion_local"
            value={formData.direccion_local}
            onChange={(e) => handleInputChange("direccion_local", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>


        <div>
          <div className="space-y-2">
            <Label htmlFor="localidad">Localidad *</Label>
            <Select
              //id="localidad"
              //className="w-full border rounded-md p-2"
              value={(formData.id_localidad).toString()}              //REVISAR NUMBER
              onValueChange={(value) => handleInputChange("id_localidad", Number(value))}
              required
              disabled={loadingLocalidades}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Seleccionar localidad" />
              </SelectTrigger>
              <SelectContent>
                
                {localidades.map((loc) => (
                  <SelectItem key={loc.id} value={(loc.id).toString()}>
                    {loc.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>


        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Cliente</Button>

      </div>
    </form >
  )
}
