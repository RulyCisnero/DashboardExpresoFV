"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { ClientesView } from "../views/clientes-view"
import  {type Cliente, type ClienteFormData } from "../../types/encomienda"

interface ViewClientesModalProps {
  clientes: Cliente[]
  open: boolean
  onOpenChange: (open: boolean) => void
 // onDeleteCliente?: (id: number) => void
}

export function ViewClientesModal({ open, onOpenChange, clientes, /* onDeleteCliente */ }: ViewClientesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestión de Clientes</DialogTitle>
        </DialogHeader>
        <ClientesView clientes={clientes} /* onDeleteCliente={onDeleteCliente} */ />
      </DialogContent>
    </Dialog>
  )
}
