"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { DestinosView } from "../views/destinos-view"
import type { Localidad, LocalidadFormData } from "../../types/encomienda"
import { Button } from "../ui/button"

interface ViewDestinosModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  localidades: Localidad[]
  loadingLocalidad: boolean
  onEditLocalidad: (id: number, data: LocalidadFormData) => Promise<void>
  onDeleteLocalidad: (localidad: Localidad) => Promise<void>
}

export function ViewDestinosModal({ open, onOpenChange, localidades, loadingLocalidad, onDeleteLocalidad, onEditLocalidad }: ViewDestinosModalProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestión de Destinos</DialogTitle>
        </DialogHeader>
        {loadingLocalidad ? (
          <p className="text-center py-6">Cargando localidades...</p>
        ) : (
          <DestinosView
            localidades={localidades}
            onEditLocalidad={onEditLocalidad} 
            onDeleteLocalidad={onDeleteLocalidad}
            onAddClick={() => { }}
            loading={loadingLocalidad}
            error={""}
          />
        )}
      </DialogContent>
      {/* </DialogContent> */}
    </Dialog>
  )
}
