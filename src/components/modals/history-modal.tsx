"use client"

import { useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { EncomiendaHistory } from "../history/encomienda-history"
import type { EncomiendaRich} from "../../types/encomienda"
import { useEncomienda } from "../../services/hooks-services/use-encomienda"


interface HistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  encomiendas: EncomiendaRich[]
}

export function HistoryModal({ open, onOpenChange, encomiendas }: HistoryModalProps) {
  const { reload } = useEncomienda({ autoLoad: false })
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (open && !hasLoadedRef.current) {
      hasLoadedRef.current = true
      reload()
    }

    if (!open) {
      hasLoadedRef.current = false
    }
  }, [open, reload])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historial de Encomiendas</DialogTitle>
          <DialogDescription>Registro completo de todas las encomiendas del sistema.</DialogDescription>
        </DialogHeader>
        <EncomiendaHistory encomiendas={encomiendas} />
      </DialogContent>
    </Dialog>
  )
}
