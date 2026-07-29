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
    const [todayKey, setTodayKey] = useState(() => new Date().toISOString().split("T")[0])
    
    const {
        encomiendas,
        getByChoferHoy,
        updateEstadoEncomienda,
    } = useEncomienda()

    useEffect(() => {
        if (usuario) {
            getByChoferHoy(usuario.id)
        }
    }, [usuario, todayKey])

    useEffect(() => {
        const interval = window.setInterval(() => {
            const currentDay = new Date().toISOString().split("T")[0]
            setTodayKey((prev) => (prev !== currentDay ? currentDay : prev))
        }, 60000)

        return () => window.clearInterval(interval)
    }, [])

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