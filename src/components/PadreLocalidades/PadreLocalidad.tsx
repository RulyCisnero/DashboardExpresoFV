import { useLocalidades } from "../../services/hooks-services/use-localidades"
import { ViewDestinosModal } from "../modals/view-destinos-modal"
import { AddDestinoModal } from "../modals/add-destino-modal"
import type { LocalidadFormData } from "../../types/encomienda"

interface PadreLocalidadProps {
 isAddOpen: boolean
 onAddClose: () => void
 isViewOpen: boolean
 onViewClose: () => void
}

export function PadreLocalidad({ isAddOpen, onAddClose, isViewOpen, onViewClose }: PadreLocalidadProps) {
// 🔹 Hook centralizado: solo acá
 const {
    localidades,
    addLocalidad,
    updateLocalidad,
    deleteLocalidad,
    reloadLocalidades,
    loadingLocalidad,
    errorLocalidad
 } = useLocalidades()

 // 🔹 Función para manejar la creación
 const handleAddLocalidad = async (data: LocalidadFormData) => {
    try {
        await addLocalidad(data)
        await reloadLocalidades()
        onAddClose()
    } catch (error) {
        console.error("Error al agregar localidad:", error)
    }
 }

 return (
 <div className="space-y-4">
    <ViewDestinosModal
        open={isViewOpen}
        onOpenChange={(open) => !open && onViewClose()}
        localidades={localidades}
        loadingLocalidad={loadingLocalidad}
        onEditLocalidad={async (id, data) => {
            await updateLocalidad(id, data)
            await reloadLocalidades()
        }}
        onDeleteLocalidad={async (localidad) => {
            await deleteLocalidad(localidad)
            await reloadLocalidades()
        }}
    />
    <AddDestinoModal
        open={isAddOpen}
        onOpenChange={(open) => !open && onAddClose()}
        onSubmit={handleAddLocalidad}
    />
  </div>
 )
}
