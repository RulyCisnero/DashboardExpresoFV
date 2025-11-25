import { useCliente } from "../../services/hooks-services/use-cliente"
import { useLocalidades } from "../../services/hooks-services/use-localidades"
import { AddClienteModal } from "../modals/add-cliente-modal"
import { ViewClientesModal } from "../modals/view-clientes-modal"
import type { Cliente, ClienteFormInput } from "../../types/encomienda"

interface PadreClienteProps {
    isAddOpen: boolean
    onAddClose: () => void
    isViewOpen: boolean
    onViewClose: () => void
}

export function PadreCliente({ isAddOpen, onAddClose, isViewOpen, onViewClose }: PadreClienteProps) {
    const {
        clientes,
        loadingCliente,
        errorCliente,
        addCliente,
        updateCliente,
        deleteCliente,
        reloadClientes,
    } = useCliente()

    //uso hook de localidades para asignarle a cliente
    const { localidades, loadingLocalidad } = useLocalidades()

    const handleAddCliente = async (data: ClienteFormInput) => {
        try {
            await addCliente(data)
            await reloadClientes()
            onAddClose()
        } catch (error) {
            console.error("Error al agregar al cliente:", error)
        }
    }

    const handleEditCliente = async (id: number, data: ClienteFormInput) => {
        try {
            await updateCliente(id, data)
            await reloadClientes()
        } catch (error) {
            console.error("Error al actualizar el cliente:", error)
        }
    }

    const handleDeleteCliente = async (data: Cliente) => {
        try {
            await deleteCliente(data)
            await reloadClientes()
        } catch (error) {
            console.error("Error al eliminar el cliente:", error)
        }
    }

    return (
        <>
            <AddClienteModal
                open={isAddOpen}
                onOpenChange={(open) => !open && onAddClose()}
                onSubmit={handleAddCliente}
                loadingLocalidades={loadingLocalidad}
                localidades={localidades} //se las pasamos al form
            />

            <ViewClientesModal
                open={isViewOpen}
                onOpenChange={onViewClose}
                clientes={clientes}
                localidades={localidades}
                loading={loadingCliente}
                error={errorCliente}
                onEditCliente={handleEditCliente}
                onDeleteCliente={handleDeleteCliente}
            />
        </>
    )
}
