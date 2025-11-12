"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import type { Localidad } from "../../types/encomienda"


interface DeleteLocalidadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  localidad?: Localidad
  onConfirm: (id: number) => void
}

export function DeleteLocalidadModal({open, onOpenChange, localidad, onConfirm }:DeleteLocalidadModalProps) {

  if (!localidad) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar destino</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Seguro que deseas eliminar la localidad <strong>{localidad.nombre}</strong>? 
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(localidad.id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
