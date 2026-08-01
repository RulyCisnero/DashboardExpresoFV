//import { useFacturas } from "../../services/hooks-services/use-facturas" // Asumiendo que crearás este hook
import { ViewFacturacionModal } from "../modals/view-facturacion-modal"
import { AddFacturaModal } from "../modals/add-factuar-modal"

interface PadreFacturacionProps {
  isAddOpen: boolean
  onAddClose: () => void
  isViewOpen: boolean
  onViewClose: () => void
  onOpenAdd: () => void // Para disparar el modal de "Nueva Factura"
}

export function PadreFacturacion({ isAddOpen, onAddClose, isViewOpen, onViewClose, onOpenAdd }: PadreFacturacionProps) {
  // 🔹 Hook centralizado para facturas
  /* const {
    facturas,
    metricas,
    addFactura,
    reloadFacturas,
    loadingFacturas,
  } = useFacturas()
 */
  // 🔹 Función para manejar la creación con AFIP
  /* const handleAddFactura = async (data: any) => {
    try {
      await addFactura(data)
      await reloadFacturas()
      onAddClose()
    } catch (error) {
      console.error("Error al emitir factura:", error)
    }
  } */

  return (
    <div className="space-y-4">
      <ViewFacturacionModal
        open={isViewOpen}
        onOpenChange={(open) => !open && onViewClose()}
       /*  facturas={facturas}
        metricas={metricas}
        loadingFacturas={loadingFacturas} */
        onAddClick={onOpenAdd} // Le pasamos la función para abrir el modal hijo
      />
      
      <AddFacturaModal
        open={isAddOpen}
        onOpenChange={(open) => !open && onAddClose()}
        //onSubmit={handleAddFactura}
      />
    </div>
  )
}