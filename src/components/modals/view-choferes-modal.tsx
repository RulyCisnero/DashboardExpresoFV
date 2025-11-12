"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { ChoferesView } from "../views/choferes-view"
import type { Chofer } from "../../types/encomienda"

interface ViewChoferesModalProps {
  choferes: Chofer[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewChoferesModal({ open, onOpenChange, choferes }: ViewChoferesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestión de Choferes</DialogTitle>
        </DialogHeader>
        <ChoferesView choferes={choferes} />
      </DialogContent>
    </Dialog>
  )
}
