"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { EncomiendaSearch } from "../search/encomienda-search"
import type { EncomiendaRich } from "../../types/encomienda"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  encomiendas: EncomiendaRich[]
  onViewDetails: (encomienda: EncomiendaRich) => void
}

export function SearchModal({ open, onOpenChange, encomiendas, onViewDetails }: SearchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buscador de Encomiendas</DialogTitle>
          <DialogDescription>
            Escribe un término para buscar en la lista de encomiendas.
          </DialogDescription>
        </DialogHeader>
        <EncomiendaSearch
          encomiendasData={encomiendas}
          onViewDetails={onViewDetails} />
      </DialogContent>
    </Dialog>
  )
}
