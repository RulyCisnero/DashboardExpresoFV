"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { ChoferForm } from "../forms/chofer-form"
import type { ChoferFormData } from "../../types/encomienda"

interface AddChoferModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ChoferFormData) => void
}

export function AddChoferModal({ open, onOpenChange, onSubmit }: AddChoferModalProps) {
  const handleSubmit = (data: ChoferFormData) => {
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Chofer</DialogTitle>
          <DialogDescription>Completa los datos del nuevo chofer</DialogDescription>
        </DialogHeader>

        <ChoferForm 
        onSubmit={handleSubmit} 
        onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
