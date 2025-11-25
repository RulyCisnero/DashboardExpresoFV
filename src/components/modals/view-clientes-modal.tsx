"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { ClientesView } from "../views/clientes-view"
import type {  Cliente, ClienteFormInput ,Localidad  } from "../../types/encomienda"

interface ViewClientesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientes: Cliente[]
  localidades: Localidad[]
  loading: boolean
  error: string | null
  onEditCliente: (id: number, data: ClienteFormInput) => Promise<void>
  onDeleteCliente: (cliente: Cliente) => Promise<void>
}

export function ViewClientesModal({ open, onOpenChange, clientes, loading, error, onDeleteCliente, onEditCliente,localidades }: ViewClientesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto"aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Gestión de Clientes</DialogTitle>
        </DialogHeader>
        {loading ? <p>Cargando...</p> :
          <ClientesView
            clientes={clientes}
            localidades={localidades}
            onEditCliente={onEditCliente}
            onDeleteCliente={onDeleteCliente}
            loading={loading}
            error={""}
          />}
      </DialogContent>
    </Dialog>
  )
}
