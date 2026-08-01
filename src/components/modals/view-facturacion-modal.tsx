"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import {FacturacionView} from "../views/FacturacionView"
import { Button } from "../ui/button"

interface ViewFacturacionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  facturas: any[] 
  metricas: any
  loadingFacturas: boolean
  onAddClick: () => void
}

export function ViewFacturacionModal({ 
  open, 
  onOpenChange, 
  facturas, 
  metricas, 
  loadingFacturas, 
  onAddClick 
}: ViewFacturacionModalProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Usamos max-w-7xl para que el dashboard entre bien en pantalla */}
      <DialogContent aria-describedby={undefined} className="sm:max-w-7xl max-h-[90vh] overflow-y-auto bg-[#0f172a] text-slate-300 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Gestión de Facturación</DialogTitle>
        </DialogHeader>
        
        {loadingFacturas ? (
          <p className="text-center py-6 text-slate-400">Cargando comprobantes...</p>
        ) : (
          <FacturacionView
            facturas={facturas}
            metricas={metricas}
            onAddClick={onAddClick}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}