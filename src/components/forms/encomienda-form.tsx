"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import type { Cliente, Localidad, EncomiendaForInput, Chofer, EncomiendaInput } from "../../types/encomienda"


interface EncomiendaFormProps {
  clientes: Cliente[]
  localidad: Localidad[]
  chofer: Chofer[]
  initialData?: Partial</* EncomiendaForInput */EncomiendaInput>
  onSubmit: (data: /* EncomiendaForInput */EncomiendaInput) => void
}

export function EncomiendaForm({ onSubmit, clientes, localidad, initialData, chofer }: EncomiendaFormProps) {

  const [formData, setFormData] = useState</* EncomiendaForInput */EncomiendaInput>({
    tipo: "ENTRANTE",
    estado: "Pendiente",
    direccion_destino: "",
    fecha_creacion: new Date(),
    descripcion: "",
    precio: 0,
    origen_id: 0,
    destino_id: 0,
    cliente_id: 0,
    cliente_destinatario_id: 0,
    chofer_id: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof /* EncomiendaFormData */EncomiendaForInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-2">
          <Label htmlFor="origen_id">Origen *</Label>
          <Select
            value={(formData.origen_id).toString()}
            onValueChange={(value) => handleInputChange("origen_id", Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar origen" />
            </SelectTrigger>
            <SelectContent>
              {localidad.map((localidad) => (
                <SelectItem key={localidad.id} value={(localidad.id).toString()}>
                  {localidad.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destino_id">Destino *</Label>
          <Select
            value={(formData.destino_id).toString()}
            onValueChange={(value) => handleInputChange("destino_id", (value))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar destino" />
            </SelectTrigger>
            <SelectContent>
              {localidad.map((localidad) => (
                <SelectItem key={localidad.id} value={(localidad.id).toString()}>
                  {localidad.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo *</Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => handleInputChange("tipo", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de encomienda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ENTRANTE">Entrante</SelectItem>
              <SelectItem value="SALIENTE">Saliente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado *</Label>
          <Select
            value={formData.estado}
            onValueChange={(value) => handleInputChange("estado", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione Estado de encomienda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Entregada">Entregada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion_destino">Direccion Encomienda *</Label>
          <Input
            id="direccion_destino"
            value={formData.direccion_destino}
            onChange={(e) => handleInputChange("direccion_destino", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chofer_id">Chofer Asignado *</Label>
          <Select
            value={(formData.chofer_id).toString()}
            onValueChange={(value) => handleInputChange("chofer_id", (value))}>
            <SelectTrigger>
              <SelectValue placeholder="Asignar chofer a la encomienda" />
            </SelectTrigger>
            <SelectContent>
              {chofer.map((chofer) => (
                <SelectItem key={chofer.id} value={(chofer.id).toString()}>
                  {chofer.nombre} {chofer.apellido}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cliente_id">Remitente *</Label>
          <Select value={(formData.cliente_id).toString()}
            onValueChange={(value) => handleInputChange("cliente_id", (value))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar remitente" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={(cliente.id).toString()}>
                  {cliente.nombre} {cliente.apellido}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cliente_destinatario_id">Destinatario *</Label>
          <Select
            value={(formData.cliente_destinatario_id).toString()}
            onValueChange={(value) => handleInputChange("cliente_destinatario_id", (value))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar destinatario" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={(cliente.id.toString())}>
                  {cliente.nombre} {cliente.apellido}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


        {/*    <div className="space-y-2">
          <Label htmlFor="remitente">Remitente *</Label>
          <Input
            id="remitente"
            value={formData.remitente.nombre} 
            onChange={(e) => handleInputChange("remitente", e.target.value)}
            required
          />
        </div>
 
        <div className="space-y-2">
          <Label htmlFor="destinatario">Destinatario *</Label>
          <Input
            id="destinatario"
            value={formData.destinatario}
            onChange={(e) => handleInputChange("destinatario", e.target.value)}
            required
          />
        </div>*/}

        <div className="space-y-2">
          <Label htmlFor="fecha_creacion">Fecha de Envío *</Label>
          <Input
            id="fecha_creacion"
            type="date"
            //value={formData.fecha_creacion}
            onChange={(e) => handleInputChange("fecha_creacion", e.target.value)}
            required
          />
        </div>

        {/*  <div className="space-y-2">
          <Label htmlFor="peso">Peso</Label>
          <Input
            id="peso"
            placeholder="ej: 2.5 kg"
            value={formData.peso}
            onChange={(e) => handleInputChange("peso", e.target.value)}
          />
        </div> */}

        <div className="space-y-2">
          <Label htmlFor="precio">Precio *</Label>
          <Input
            id="precio"
            placeholder="ej: $15,000"
            value={formData.precio}
            onChange={(e) => handleInputChange("precio", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          placeholder="Descripción del contenido..."
          value={formData.descripcion}
          onChange={(e) => handleInputChange("descripcion", e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">Guardar Encomienda</Button>
      </div>
    </form>
  )
}
