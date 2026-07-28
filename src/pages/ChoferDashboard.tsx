import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useEncomienda } from "../services/hooks-services/use-encomienda"
import { DashboardHeader } from "../components/dashboard/dashboard-header"
import { EncomiendasTable } from "../components/dashboard/encomiendas-table"
import { EncomiendaDetailModal } from "../components/modals/encomienda-detail-modal"
import type { EncomiendaRich } from "../types/encomienda"

export default function ChoferDashboard() {
    const { usuario } = useAuth()
    const [selectedEncomienda, setSelectedEncomienda] = useState<EncomiendaRich | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    
    const {
        encomiendas,
        getByChoferHoy,
        updateEstadoEncomienda,
    } = useEncomienda()

    useEffect(() => {
        if (usuario) {
            getByChoferHoy(usuario.id)
        }
    }, [usuario])

    const marcarEntregada = (id: number) => {
        updateEstadoEncomienda(id, "Entregada")
    }

    const handleViewDetails = (encomienda: EncomiendaRich) => {
        setSelectedEncomienda(encomienda)
        setIsDetailOpen(true)
    }

    return (
        <div>
            <DashboardHeader
                onOpenMenu={() => { }}
            />
            <EncomiendasTable
                modo="chofer"
                encomiendasData={encomiendas}
                onViewDetails={handleViewDetails}
                onMarcarEntregada={(encomiendaId) => marcarEntregada(encomiendaId)}
            />
            <EncomiendaDetailModal
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                encomienda={selectedEncomienda}
                modo="chofer"
                onMarcarEntregada={marcarEntregada}
            />
        </div>
    )
}