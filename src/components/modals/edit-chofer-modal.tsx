"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { ChoferForm } from "../forms/chofer-form"
import type { Chofer, ChoferFormData } from "../../types/encomienda"

interface EditChoferModalProps {
    open: boolean
    chofer?: Chofer
    onOpenChange: (open: boolean) => void
    onSubmit: (id: number, data: ChoferFormData) => void
}

export function EditChoferModal({ open, onOpenChange, onSubmit, chofer }: EditChoferModalProps) {
    if (!chofer) return null
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined} className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Editar Chofer</DialogTitle>
                    <DialogDescription>Modificá los nuevos datos del chofer seleccionado</DialogDescription>
                </DialogHeader>

                <ChoferForm
                    textoActual={chofer}
                    onSubmit={(data) => onSubmit(chofer.id, data)}
                    onCancel={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    )
}
