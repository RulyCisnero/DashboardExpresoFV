"use client"

import { useState, useMemo } from "react"
import { useEncomiendas } from "../hooks/use-encomiendas"
import { DashboardHeader } from "../components/dashboard/dashboard-header"
import { StatsCards } from "../components/dashboard/stats-cards"
import { EncomiendasTable } from "../components/dashboard/encomiendas-table"
import { EncomiendaDetailModal } from "../components/modals/encomienda-detail-modal"
import { AddEncomiendaModal } from "../components/modals/add-encomienda-modal"
import { EditEncomiendaModal } from "../components/modals/edit-encomienda-modal"
import { AddClienteModal } from "../components/modals/add-cliente-modal"
import type { Encomienda, Localidad } from "../types/encomienda"

export default function Dashboard() {
  const {
    encomiendas,
    clientes,
    choferes,
    destinos,
    addEncomienda,
    updateEncomienda,
    deleteEncomienda,
    addCliente,
    addChofer,
    addDestino,
  } = useEncomiendas()

  // Estados de filtros
  const [selectedLocalidad, setSelectedLocalidad] = useState<Localidad>("Todas")

  // Modal states
  const [selectedEncomienda, setSelectedEncomienda] = useState<Encomienda | null>(null)
  const [editingEncomienda, setEditingEncomienda] = useState<Encomienda | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddEncomiendaOpen, setIsAddEncomiendaOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddClienteOpen, setIsAddClienteOpen] = useState(false)

  // Filtrar encomiendas por localidad
  const filteredEncomiendas = useMemo(() => {
    if (selectedLocalidad === "ASD") {
      return encomiendas
    }
    return encomiendas.filter((enc) => enc.origen === selectedLocalidad || enc.destino === selectedLocalidad)
  }, [encomiendas, selectedLocalidad])

  // Handlers
  const handleViewDetails = (encomienda: Encomienda) => {
    setSelectedEncomienda(encomienda)
    setIsDetailOpen(true)
  }

  const handleEditEncomienda = (encomienda: Encomienda) => {
    setEditingEncomienda(encomienda)
    setIsEditOpen(true)
  }

  const handleDeleteEncomienda = (id: number) => {
    deleteEncomienda(id)
  }

  const handleUpdateEncomienda = (data: any) => {
    if (editingEncomienda) {
      updateEncomienda(editingEncomienda.id, data)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <DashboardHeader
          onAddEncomienda={() => setIsAddEncomiendaOpen(true)}
          onShowBuscador={() => {}} // TODO: Implement search
          onShowHistorial={() => {}} // TODO: Implement history
          onViewClientes={() => setIsAddClienteOpen(true)} // Simplified for now
          onViewChoferes={() => {}} // TODO: Implement
          onViewDestinos={() => {}} // TODO: Implement
        />

        {/* Stats Cards */}
        <StatsCards encomiendas={filteredEncomiendas} />

        {/* Encomiendas Table */}
       {/*  <EncomiendasTable
          encomiendas={filteredEncomiendas}
          onViewDetails={handleViewDetails}
          onEdit={handleEditEncomienda}
          onDelete={handleDeleteEncomienda}
        />
      </div> */}

      {/* Modals */}
      <EncomiendaDetailModal encomienda={selectedEncomienda} open={isDetailOpen} onOpenChange={setIsDetailOpen} />

      <AddEncomiendaModal
        open={isAddEncomiendaOpen}
        onOpenChange={setIsAddEncomiendaOpen}
        onSubmit={addEncomienda}
        clientes={clientes}
        destinos={destinos}
      />

      <EditEncomiendaModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={handleUpdateEncomienda}
        encomienda={editingEncomienda}
        clientes={clientes}
        destinos={destinos}
      />

      <AddClienteModal open={isAddClienteOpen} onOpenChange={setIsAddClienteOpen} onSubmit={addCliente} />
    </div>
  )
}
