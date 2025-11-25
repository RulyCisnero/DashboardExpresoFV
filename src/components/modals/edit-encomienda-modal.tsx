"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { EncomiendaForm } from "../forms/encomienda-form"
import type { Encomienda, EncomiendaFormData, Cliente, EncomiendaForInput, Localidad, Chofer, EncomiendaView } from "../../types/encomienda"

interface EditEncomiendaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: /* EncomiendaFormData */  EncomiendaForInput) => void
  encomienda: /* Encomienda */EncomiendaView | null
  clientes: Cliente[]
  chofer: Chofer[]
  localidades: Localidad[]
}

export function EditEncomiendaModal({ open, onOpenChange, onSubmit, encomienda, clientes, localidades, chofer }: EditEncomiendaModalProps) {


  if (!encomienda) return null
  /* 
  const initialData: EncomiendaForInput  = {
    tipo: encomienda.tipo || "ENTRANTE"||"SALIENTE",
    estado: encomienda.estado || "Pendiente" ||"Entregada",
    direccion_destino: encomienda.direccion_destino,
    fecha_creacion: new Date(encomienda.fecha_creacion),
    descripcion: encomienda.descripcion||"",
    precio: encomienda.precio,
    origen_id: encomienda.origen_id ||  0,
    destino_id: encomienda.destino_id || 0,
    cliente_id: encomienda.cliente_id || 0,
    cliente_destinatario_id: encomienda.cliente_destinatario_id || 0,
    chofer_id: encomienda.chofer_id || 0, 
  } */
  const initialData: EncomiendaForInput | undefined =
    encomienda
      ? {
        tipo: encomienda.tipo,
        estado: encomienda.estado,
        direccion_destino: encomienda.direccion_destino,
        fecha_creacion: encomienda.fecha_creacion,
        descripcion: encomienda.descripcion,
        precio: encomienda.precio,

        // ⚠ Aquí mapeamos OBJETOS → IDs
        cliente_id: encomienda.cliente.id,
        cliente_destinatario_id: encomienda.destinatario.id,
        origen_id: encomienda.origen.id,
        destino_id: encomienda.destino.id,
        chofer_id: encomienda.chofer?.id ?? 0
      }
      : undefined
  const handleSubmit = (data:  /* EncomiendaFormData  */ EncomiendaForInput) => {
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Encomienda - {encomienda.id}</DialogTitle>
        </DialogHeader>
        <EncomiendaForm
          initialData={initialData}
          onSubmit={handleSubmit}
          clientes={clientes}
          localidad={localidades}
          chofer={chofer}
          /* initialData={encomienda}  */
        />
      </DialogContent>
    </Dialog>
  )
}
