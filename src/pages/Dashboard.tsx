"use client"

import { useState, useMemo } from "react"
import { useEncomienda } from "../services/hooks-services/use-encomienda"
import { useLocalidades } from "../services/hooks-services/use-localidades"
import { useChoferes } from "../services/hooks-services/use-choferes"
import { useCliente } from "../services/hooks-services/use-cliente"

// Components
import { DashboardHeader } from "../components/dashboard/dashboard-header"
import { DesktopSidebar } from "../components/layout/sidebar"
import { StatsCards } from "../components/dashboard/stats-cards"
import { EncomiendasTable } from "../components/dashboard/encomiendas-table"
import { EncomiendaDetailModal } from "../components/modals/encomienda-detail-modal"
import { AddEncomiendaModal } from "../components/modals/add-encomienda-modal"
import { EditEncomiendaModal } from "../components/modals/edit-encomienda-modal"
//import { AddClienteModal } from "../components/modals/add-cliente-modal"
import { AddChoferModal } from "../components/modals/add-chofer-modal"
import { SearchModal } from "../components/modals/search-modal"
import { HistoryModal } from "../components/modals/history-modal"
//import { ViewClientesModal } from "../components/modals/view-clientes-modal"
import { ViewChoferesModal } from "../components/modals/view-choferes-modal"
import { PadreLocalidad } from "../components/PadreLocalidades/PadreLocalidad"
import { PadreCliente } from "../components/padreCliente/padreCliente"

import type { Encomienda, EncomiendaTable, EncomiendaView, Localidad } from "../types/encomienda"


/**
 * Componente principal del Dashboard
 */
export default function Dashboard() {
  //hook de encomiendas
  const { encomiendasApi, addNewEncomienda, getEncomiendaById, deleteEncomienda, updateEncomienda } = useEncomienda()

  // 👉 Hook solo de localidades (destinos)
  const {
    localidades
  } = useLocalidades()

  // 🔍 Hook solo de choferes
  const {
    choferes,
    addChofer
  } = useChoferes()

  //hook para clientes
  const {
    clientes
  } = useCliente()

  // Estados de filtros
  const [selectedLocalidad, setSelectedLocalidad] = useState<Localidad | "Todas">("Todas")


  // Modal states
  //const [selectedEncomienda, setSelectedEncomienda] = useState<Encomienda | null>(null)
  const [selectedEncomiendaView, setSelectedEncomiendaView] = useState<EncomiendaView | null>(null)
  const [editingEncomienda, setEditingEncomienda] = useState<EncomiendaView | null>(null)
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
  const filteredEncomiendas = useMemo(() => {
    if (selectedLocalidad === "Todas") return encomiendasApi
    return encomiendasApi.filter(
      (enc) =>
        enc.origen.nombre === selectedLocalidad.nombre ||
        enc.destino.nombre === selectedLocalidad.nombre
    )
  }, [encomiendasApi, selectedLocalidad])

  // Handlers
  const handleViewDetails = (encomienda: EncomiendaView) => {
    setSelectedEncomiendaView(encomienda)
    setIsDetailOpen(true)
  }

  /* const handleEditEncomienda = (encomienda: EncomiendaView) => {
    console.log("id de la encomienda seleccionada: ",encomienda.id)
    setEditingEncomienda(encomienda)
    setIsEditOpen(true)
  } */
  const handleEditEncomienda = async (encomienda: EncomiendaTable) => {
    const encomiendaCompleta = await getEncomiendaById(encomienda.id);
    console.log('Fetch en : ', encomiendaCompleta)
    if (encomiendaCompleta) {
      setEditingEncomienda(encomiendaCompleta);
      setIsEditOpen(true);
    }
  };

  const handleDeleteEncomienda = (encomienda: Encomienda) => {
    deleteEncomienda(encomienda)
  }

  const handleUpdateEncomienda = (data: any) => {
    if (editingEncomienda) {
      updateEncomienda(editingEncomienda.id, data)
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
        <div className="container mx-auto p-4 space-y-8">
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
        chofer={choferes}
        localidades={localidades}
      />

      <AddChoferModal
        open={isAddChoferOpen}
        onOpenChange={setIsAddChoferOpen}
        onSubmit={addChofer} />

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

      <PadreCliente
        isAddOpen={isAddClienteOpen}
        onAddClose={() => setIsAddClienteOpen(false)}
        isViewOpen={isViewClientesOpen}
        onViewClose={() => setIsViewClientesOpen(false)}
      />

      <ViewChoferesModal
        open={isViewChoferesOpen}
        onOpenChange={setIsViewChoferesOpen}
        choferes={choferes}
      />

      <PadreLocalidad
        isAddOpen={isAddDestinoOpen}
        onAddClose={() => setIsAddDestinoOpen(false)}
        isViewOpen={isViewDestinosOpen}
        onViewClose={() => setIsViewDestinosOpen(false)}
      />
    </div>
  )
}
