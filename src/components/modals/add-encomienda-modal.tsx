"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { EncomiendaForm } from "../forms/encomienda-form"
import type { EncomiendaInput, Cliente, Localidad, Chofer } from "../../types/encomienda"

interface AddEncomiendaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EncomiendaInput) => void
  clientes: Cliente[]
  localidades: Localidad[]
  choferes: Chofer[]
}

export function AddEncomiendaModal({ open, onOpenChange, onSubmit, clientes, localidades,choferes

 }: AddEncomiendaModalProps) {
  const handleSubmit = (data: EncomiendaInput) => {
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Encomienda</DialogTitle>
        </DialogHeader>
        <EncomiendaForm
          onSubmit={handleSubmit}
          clientes={clientes}
          chofer={choferes}
          localidad={localidades} />
      </DialogContent>
    </Dialog>
  )
}
