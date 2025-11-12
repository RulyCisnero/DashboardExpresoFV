"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { ClienteForm } from "../forms/cliente-form"
import type { Cliente, ClienteFormInput } from "../../types/encomienda"

interface EditClienteModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (id: number, data: ClienteFormInput) => void
    cliente?: Cliente
}

export function EditClienteModal({ open, onOpenChange, onSubmit, cliente }: EditClienteModalProps) {
    /*  const handleSubmit = (data: ClienteFormData) => {
       onSubmit(data)
       onOpenChange(false)
     } */
    if (!cliente) return null
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
                    onSubmit={(data) => onSubmit(cliente.id, data)}
                    onCancel={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    )
}
