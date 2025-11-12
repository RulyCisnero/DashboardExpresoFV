"use client"

import { useState, useMemo } from "react"
//import { useEncomiendas } from "../hooks/use-encomiendas"
import { useEncomienda } from "../services/hooks-services/use-encomienda"
import { useLocalidades } from "../services/hooks-services/use-localidades"
import { useChoferes } from "../services/hooks-services/use-choferes"
import { useCliente } from "../services/hooks-services/use-cliente"

/* import { addChofer } from "@/hooks/use-choferes"
import { addDestino } from "@/hooks/use-destinos" */

// Components
import { DashboardHeader } from "../components/dashboard/dashboard-header"
import { DesktopSidebar } from "../components/layout/sidebar"
import { StatsCards } from "../components/dashboard/stats-cards"
import { EncomiendasTable } from "../components/dashboard/encomiendas-table"
import { EncomiendaDetailModal } from "../components/modals/encomienda-detail-modal"
import { AddEncomiendaModal } from "../components/modals/add-encomienda-modal"
import { EditEncomiendaModal } from "../components/modals/edit-encomienda-modal"
import { AddClienteModal } from "../components/modals/add-cliente-modal"
import { AddChoferModal } from "../components/modals/add-chofer-modal"
import { AddDestinoModal } from "../components/modals/add-destino-modal"
import { SearchModal } from "../components/modals/search-modal"
import { HistoryModal } from "../components/modals/history-modal"
import { ViewClientesModal } from "../components/modals/view-clientes-modal"
import { ViewChoferesModal } from "../components/modals/view-choferes-modal"
import { ViewDestinosModal } from "../components/modals/view-destinos-modal"

import type { Encomienda, EncomiendaView, Localidad, EncomiendaTable } from "../types/encomienda"
import type { LocalidadFormData } from "../types/encomienda"


/**
 * Componente principal del Dashboard
 */
export default function Dashboard() {
  //hook de encomiendas hardcodeado
  //const { encomiendas, addEncomienda, updateEncomienda, deleteEncomienda } = useEncomiendas()

  //hook verdadero de encomiendas
  const { encomiendasApi, addNewEncomienda, deleteEncomienda, updateEncomienda } = useEncomienda()

  // 👉 Hook solo de localidades (destinos)
  const {
    localidades,
    loadingLocalidad,
    addLocalidad
  } = useLocalidades()

  // 🔍 Hook solo de choferes
  const {
    choferes,
    addChofer
  } = useChoferes()

  //hook para clientes
  const {
    clientes,
    addCliente
  } = useCliente()

  // Estados de filtros
  const [selectedLocalidad, setSelectedLocalidad] = useState<Localidad | "Todas">("Todas")


  // Modal states
  const [selectedEncomienda, setSelectedEncomienda] = useState<Encomienda | null>(null)
  const [selectedEncomiendaView, setSelectedEncomiendaView] = useState<EncomiendaView | null>(null)
  const [editingEncomienda, setEditingEncomienda] = useState<Encomienda | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddEncomiendaOpen, setIsAddEncomiendaOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddClienteOpen, setIsAddClienteOpen] = useState(false)
  const [isAddChoferOpen, setIsAddChoferOpen] = useState(false)
  const [isAddDestinoOpen, setIsAddDestinoOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isViewClientesOpen, setIsViewClientesOpen] = useState(false)
  const [isViewChoferesOpen, setIsViewChoferesOpen] = useState(false)
  const [isViewDestinosOpen, setIsViewDestinosOpen] = useState(false)

  // Filtrar encomiendas por localidad
  /*   const filteredEncomiendas = useMemo(() => {
      if (selectedLocalidad.nombre === "Todas") {
        return encomiendasApi
      }
      return encomiendasApi.filter((enc) => enc.origen_id === selectedLocalidad.id || enc.destino_id === selectedLocalidad.id)
    }, [encomiendasApi, selectedLocalidad])
   */
  const filteredEncomiendas = useMemo(() => {
    if (selectedLocalidad === "Todas") return encomiendasApi
    return encomiendasApi.filter(
      (enc) =>
        enc.origen_id === selectedLocalidad.id ||
        enc.destino_id === selectedLocalidad.id
    )
  }, [encomiendasApi, selectedLocalidad])

  // Handlers
  const handleViewDetails = (encomienda: EncomiendaView) => {
    setSelectedEncomiendaView(encomienda)
    setIsDetailOpen(true)
  }

  const handleEditEncomienda = (encomienda: Encomienda) => {
    setEditingEncomienda(encomienda)
    setIsEditOpen(true)
  }

  const handleDeleteEncomienda = (encomienda: Encomienda) => {
    deleteEncomienda(encomienda)
  }

  const handleUpdateEncomienda = (data: any) => {
    if (editingEncomienda) {
      updateEncomienda(editingEncomienda.id, data)
    }
  }

  const handleAddDestino = async (localidad: LocalidadFormData) => {
    try {
      await addLocalidad(localidad)  // usa el hook y hace POST al backend
    } catch (error) {
      console.error("Error al agregar localidad:", error)
    }
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <DesktopSidebar
        onAddEncomienda={() => setIsAddEncomiendaOpen(true)}
        onAddCliente={() => setIsAddClienteOpen(true)}
        onAddChofer={() => setIsAddChoferOpen(true)}
        onAddDestino={() => setIsAddDestinoOpen(true)}
        onShowHistorial={() => setIsHistoryOpen(true)}
        onShowBuscador={() => setIsSearchOpen(true)}
        onViewClientes={() => setIsViewClientesOpen(true)}
        onViewChoferes={() => setIsViewChoferesOpen(true)}
        onViewDestinos={() => setIsViewDestinosOpen(true)}
      />

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Header */}
        <DashboardHeader
        /*    onAddEncomienda={() => setIsAddEncomiendaOpen(true)}
           onAddCliente={() => setIsAddClienteOpen(true)}
           onAddChofer={() => setIsAddChoferOpen(true)}
           onAddDestino={() => setIsAddDestinoOpen(true)}
           onShowHistorial={() => setIsHistoryOpen(true)}
           onShowBuscador={() => setIsSearchOpen(true)}
           onViewClientes={() => setIsViewClientesOpen(true)}
           onViewChoferes={() => setIsViewChoferesOpen(true)}
           onViewDestinos={() => setIsViewDestinosOpen(true)}   */
          localidades={localidades}
          selectedLocalidad={selectedLocalidad}
          onLocalidadChange={setSelectedLocalidad}
        //onViewDestinos={() => setIsViewDestinosOpen(true)}
        />

        {/* Dashboard Content */}
        <div className="container mx-auto p-6 space-y-8">
          {/* Stats Cards */}
          <StatsCards encomiendas={filteredEncomiendas} />

          {/* Encomiendas Table */}
          <EncomiendasTable
            encomiendas={filteredEncomiendas}
            encomiendasData={/* encomiendas */encomiendasApi}
            onViewDetails={handleViewDetails}
            onEdit={handleEditEncomienda}
            onDelete={handleDeleteEncomienda}
          />
        </div>
      </div>

      {/* Modals */}
      <EncomiendaDetailModal
        encomienda={selectedEncomiendaView}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen} />

      <AddEncomiendaModal
        open={isAddEncomiendaOpen}
        onOpenChange={setIsAddEncomiendaOpen}
        onSubmit={/* addEncomienda */addNewEncomienda}
        clientes={clientes}
        choferes={choferes}
        localidades={localidades}
      />

      <EditEncomiendaModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={handleUpdateEncomienda}
        encomienda={editingEncomienda}
        clientes={clientes}
        destinos={localidades}
      />

      <AddClienteModal
        open={isAddClienteOpen}
        onOpenChange={setIsAddClienteOpen}
        onSubmit={addCliente}
      />

      <AddChoferModal
        open={isAddChoferOpen}
        onOpenChange={setIsAddChoferOpen}
        onSubmit={addChofer} />

      <AddDestinoModal
        open={isAddDestinoOpen}
        onOpenChange={setIsAddDestinoOpen}
        /* onSubmit={addDestino} */
        onSubmit={handleAddDestino}
      />

      <SearchModal
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        encomiendas={encomiendasApi/* encomiendas */}
        onViewDetails={handleViewDetails}
      />

      <HistoryModal
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        encomiendas={encomiendasApi /* encomiendas} */}
      />

      <ViewClientesModal
        open={isViewClientesOpen}
        onOpenChange={setIsViewClientesOpen}
        clientes={clientes}
      />

      <ViewChoferesModal
        open={isViewChoferesOpen}
        onOpenChange={setIsViewChoferesOpen}
        choferes={choferes}
      />

      <ViewDestinosModal
        open={isViewDestinosOpen}
        onOpenChange={setIsViewDestinosOpen}
        //localidades={localidades}
         {...localidades} 
        /* onDeleteLocalidad={(id) =>
          setLocalidades((prev) => prev.filter((loc) => loc.id !== id))
        } */
      />
    </div>
  )
}
