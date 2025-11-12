"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { DestinoForm } from "../forms/destino-form"
import type { LocalidadFormData } from "../../types/encomienda"

interface AddDestinoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: LocalidadFormData) => void
}

export function AddDestinoModal({ open, onOpenChange, onSubmit }: AddDestinoModalProps) {
  const handleSubmit = (data: LocalidadFormData) => {
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Destino</DialogTitle>
          <DialogDescription>Completa los datos del nuevo destino</DialogDescription>
        </DialogHeader>

        <DestinoForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
