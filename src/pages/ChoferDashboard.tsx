import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react"
import { useEncomienda } from "../services/hooks-services/use-encomienda"
import { DashboardHeader } from "../components/dashboard/dashboard-header"
import { EncomiendasTable } from "../components/dashboard/encomiendas-table"



export default function ChoferDashboard() {
    const { usuario } = useAuth()
    
    const {
        encomiendas,
        getByChofer,
        updateEstadoEncomienda
    } = useEncomienda()

    useEffect(() => {

        if (usuario?.id) {
            getByChofer(usuario.id)
        }

    }, [usuario])
    console.log("USUARIO CHOFER:", usuario)
    console.log("ENCOMIENDAS DEL CHOFER:", encomiendas)

    const marcarEntregada = (id: number) => {
        updateEstadoEncomienda(
            id, "Entregada"
        )
        console.log('Click entregada');
    }

    return (

        <div>
            <DashboardHeader
                onOpenMenu={() => { }}
            />
            <EncomiendasTable
                modo="chofer"
                encomiendasData={encomiendas}
                onViewDetails={() => {}}
                onMarcarEntregada={encomiendaId => marcarEntregada(encomiendaId)}
            />
        </div>
    )
}