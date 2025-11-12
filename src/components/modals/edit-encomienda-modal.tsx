"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { EncomiendaForm } from "../forms/encomienda-form"
import type { Encomienda, EncomiendaFormData, Cliente, Destino, EncomiendaForInput } from "../../types/encomienda"

interface EditEncomiendaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EncomiendaFormData /* EncomiendaForInput */) => void
  encomienda: Encomienda | null
  clientes: Cliente[]
  destinos: Destino[]
}

export function EditEncomiendaModal({open,onOpenChange,onSubmit,encomienda,clientes,destinos,}: EditEncomiendaModalProps) {
  const handleSubmit = (data:  EncomiendaFormData /* EncomiendaForInput */) => {
    onSubmit(data)
    onOpenChange(false)
  }

  if (!encomienda) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Encomienda - {encomienda.id}</DialogTitle>
        </DialogHeader>
        <EncomiendaForm 
        onSubmit={handleSubmit} 
        clientes={clientes} 
        destinos={destinos} 
        initialData={encomienda} />
      </DialogContent>
    </Dialog>
  )
}
