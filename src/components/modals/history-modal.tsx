"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { EncomiendaHistory } from "../history/encomienda-history"
import type { EncomiendaRich} from "../../types/encomienda"
import { useEncomienda } from "../../services/hooks-services/use-encomienda"


interface HistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  encomiendas: EncomiendaRich[]
}

export function HistoryModal({ open, onOpenChange }: HistoryModalProps) {
  //hook verdadero de encomiendas
  const { encomiendas, loadingEncomiendas,reload } = useEncomienda();

  // Solo hacer fetch cuando se abre
  useEffect(() => {
    if (open) {
      reload();
    }
  }, [open]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historial de Encomiendas</DialogTitle>
          <DialogDescription>Aca se ven todas las encomiendas pasadas</DialogDescription>
        </DialogHeader>
        <EncomiendaHistory encomiendas={encomiendas} />
      </DialogContent>
    </Dialog>
  )
}
