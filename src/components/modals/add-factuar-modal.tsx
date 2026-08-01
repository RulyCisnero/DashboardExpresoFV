"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { CheckSquare, Square, User, FileText } from "lucide-react"

interface AddFacturaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
}

export function AddFacturaModal({ open, onOpenChange, onSubmit }: AddFacturaModalProps) {
  
  // Función temporal para simular el envío
  const handleSubmit = () => {
    onSubmit({ total: 33275, clienteId: 1 })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1e293b] text-slate-300 border-slate-700">
        <DialogHeader className="border-b border-slate-700/50 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg">
              <FileText size={20} />
            </div>
            <DialogTitle className="text-xl text-white">Nueva Factura Electrónica</DialogTitle>
          </div>
        </DialogHeader>

        {/* CUERPO DEL MODAL (El diseño UI que hicimos) */}
        <div className="py-4 space-y-8">
          
          {/* PASO 1 */}
          <div>
            <h4 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">1. Seleccionar Cliente</h4>
            <div className="relative">
              <User size={18} className="absolute left-3 top-3 text-slate-500" />
              <input 
                type="text" 
                defaultValue="Distribuidora del Sur S.A. (CUIT: 30-12345678-9)"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500"
                readOnly
              />
            </div>
          </div>

          {/* PASO 2 */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <h4 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider">2. Encomiendas a facturar</h4>
              <button className="text-xs text-slate-400 flex items-center hover:text-white transition">
                <CheckSquare size={14} className="mr-1.5" /> Seleccionar todas
              </button>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-700 text-slate-400">
                    <th className="p-3 w-10 text-center"></th>
                    <th className="p-3">Código</th>
                    <th className="p-3">Destino</th>
                    <th className="p-3 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  <tr className="hover:bg-slate-700/30 transition bg-slate-700/20">
                    <td className="p-3 text-center text-emerald-500"><CheckSquare size={18} /></td>
                    <td className="p-3 text-white font-medium">ENC-101</td>
                    <td className="p-3 text-slate-300">Bahía Blanca</td>
                    <td className="p-3 text-white text-right">$ 15,000.00</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition">
                    <td className="p-3 text-center text-slate-500"><Square size={18} /></td>
                    <td className="p-3 text-white font-medium">ENC-99</td>
                    <td className="p-3 text-slate-300">Bahía Blanca</td>
                    <td className="p-3 text-white text-right">$ 15,000.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PASO 3 */}
          <div>
            <h4 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-3">3. Resumen</h4>
            <div className="bg-[#0f172a] rounded-lg p-5 border border-slate-700 flex justify-end">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Subtotal Gravado:</span><span>$ 27,500.00</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm border-b border-slate-700 pb-2">
                  <span>IVA (21%):</span><span>$ 5,775.00</span>
                </div>
                <div className="flex justify-between text-white text-xl font-bold pt-2">
                  <span>Total a Facturar:</span><span className="text-emerald-400">$ 33,275.00</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER DEL MODAL */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700/50">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-500 text-white">
            Emitir Factura AFIP
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}