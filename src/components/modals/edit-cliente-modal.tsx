"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { ClienteForm } from "../forms/cliente-form"
import type { Cliente, ClienteFormInput, Localidad } from "../../types/encomienda"

interface EditClienteModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    cliente?: Cliente
    localidades: Localidad[]
    loadingLocalidades?: boolean
    onSubmit: (id: number, data: ClienteFormInput) => void
}

export function EditClienteModal({ open, onOpenChange, onSubmit, cliente , localidades, loadingLocalidades}: EditClienteModalProps) {
    if (!cliente) return null
    const handleSubmit = async (data: ClienteFormInput) => {
        await onSubmit(cliente.id, data)
        onOpenChange(false)
    }
  /*   const handleSubmit = (data: ClienteFormInput) => {
        onSubmit(cliente?.id, data)
        onOpenChange(false)
    } */
    /*   async function handleSubmit(data: ClienteFormInput) {
          if (!cliente) return
          await onSubmit(cliente.id, data)
          onOpenChange(false) // OK porque el padre ya hizo reload
      } */
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined} className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Nuevo Cliente</DialogTitle>
                </DialogHeader>
                <ClienteForm
                    initialData={{
                        nombre: cliente.nombre,
                        apellido: cliente.apellido,
                        telefono: cliente.telefono,
                        email: cliente.email,
                        direccion_local: cliente.direccion_local,
                        id_localidad: cliente.localidad.id,
                    }}
                    onSubmit={handleSubmit}
                    /* onSubmit={(data) => onSubmit(cliente.id, data)} */
                    onCancel={() => onOpenChange(false)}
                    localidades={localidades}
                    loadingLocalidades={loadingLocalidades}
                />
            </DialogContent>
        </Dialog>
    )
}
