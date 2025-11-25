"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { ClienteForm } from "../forms/cliente-form"
import type { ClienteFormInput, Localidad } from "../../types/encomienda"

interface AddClienteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ClienteFormInput) => void
  localidades: Localidad[]
  loadingLocalidades?: boolean
}

export function AddClienteModal({ open, onOpenChange, onSubmit, localidades, loadingLocalidades }: AddClienteModalProps) {
  
  const handleSubmit = (data: ClienteFormInput) => {
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Cliente</DialogTitle>
        </DialogHeader>
        <ClienteForm
          /* onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}  */
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          localidades={localidades}
          loadingLocalidades={loadingLocalidades}
        />
      </DialogContent>
    </Dialog>
  )
}
