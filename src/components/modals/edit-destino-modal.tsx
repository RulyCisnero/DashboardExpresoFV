"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog"
import type { Localidad, LocalidadFormData } from "../../types/encomienda"
import { DestinoForm } from "../forms/destino-form"

interface EditDestinoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  localidad?: Localidad
  onSubmit: (id: number, data: LocalidadFormData) => void
}

export function EditDestinoModal({
  open,
  onOpenChange,
  localidad,
  onSubmit,
}: EditDestinoModalProps) {
  if (!localidad) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Localidad</DialogTitle>
          <DialogDescription>
            Modificá el nombre de la localidad seleccionada.
          </DialogDescription>
        </DialogHeader>

        <DestinoForm
          textoActual={{ nombre: localidad.nombre }}
          onSubmit={(data) => onSubmit(localidad.id, data)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

