"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { MonthlyAnalyticsView, type MonthlyDestinationMetric } from "../views/monthly-analytics-view"

interface MonthlyAnalyticsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  metrics: MonthlyDestinationMetric[]
}

export function MonthlyAnalyticsModal({ open, onOpenChange, metrics }: MonthlyAnalyticsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Analíticas mensuales por destino</DialogTitle>
        </DialogHeader>

        <MonthlyAnalyticsView metrics={metrics} />
      </DialogContent>
    </Dialog>
  )
}
