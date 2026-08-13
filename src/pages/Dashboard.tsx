"use client"

import { useState, useMemo, useEffect } from "react"
import { useEncomienda } from "../services/hooks-services/use-encomienda"
import { useLocalidades } from "../services/hooks-services/use-localidades"
import { useChoferes } from "../services/hooks-services/use-choferes"
import { useCliente } from "../services/hooks-services/use-cliente"
import { useEncomiendaByDate } from "../services/hooks-services/use-encomiendasPorFecha"
import { useAuth } from "../hooks/useAuth"

// Components
import { DashboardHeader } from "../components/dashboard/dashboard-header"
import { Sidebar, DesktopSidebar } from "../components/layout/sidebar"
import { StatsCards } from "../components/dashboard/stats-cards"
import { EncomiendasTable } from "../components/dashboard/encomiendas-table"
import { EncomiendaDetailModal } from "../components/modals/encomienda-detail-modal"
import { AddEncomiendaModal } from "../components/modals/add-encomienda-modal"
import { EditEncomiendaModal } from "../components/modals/edit-encomienda-modal"
import { AddChoferModal } from "../components/modals/add-chofer-modal"
import { SearchModal } from "../components/modals/search-modal"
import { HistoryModal } from "../components/modals/history-modal"
import { ViewChoferesModal } from "../components/modals/view-choferes-modal"
import { PadreLocalidad } from "../components/PadreLocalidades/PadreLocalidad"
import { PadreCliente } from "../components/padreCliente/padreCliente"
import { Filterlocalidades } from "../components/dashboard/localidades-filter"

import type { EncomiendaRich, Localidad } from "../types/encomienda"
import { DateFilter } from "../components/dashboard/DateFilter"
import { ExportarExcelButton } from "../components/dashboard/ExportarExcelButton"
import {PadreFacturacion} from "../components/PadreFacturacion/PadreFacturacion"
import { MonthlyAnalyticsView } from "../components/views/monthly-analytics-view"
import { buildMonthlyDestinationAnalytics } from "../lib/monthly-analytics"
import { Button } from "../components/ui/button"


/**
 * Componente principal del Dashboard
 */
export default function Dashboard() {

  const { encomiendas, addNewEncomienda, getEncomiendaById, deleteEncomienda, updateEncomienda } = useEncomienda()

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

  const { getByDate } = useEncomiendaByDate(clientes, choferes, localidades);

  // Estados de filtros
  const [selectedLocalidad, setSelectedLocalidad] = useState<Localidad | "Todas">("Todas")


  // Modal states
  //const [selectedEncomienda, setSelectedEncomienda] = useState<Encomienda | null>(null)
  const [selectedEncomiendaView, setSelectedEncomiendaView] = useState<EncomiendaRich | null>(null)
  const [editingEncomienda, setEditingEncomienda] = useState<EncomiendaRich | null>(null)
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
  const [isFacturacionOpen, setIsFacturacionOpen] = useState(false)
  const [isMonthlyAnalyticsOpen, setIsMonthlyAnalyticsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { usuario } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)


  // Filtrar encomiendas por localidad
  const filteredEncomiendas = useMemo(() => {
    if (selectedLocalidad === "Todas") return encomiendas
    return encomiendas.filter(
      (enc) =>
        enc.origen.nombre === selectedLocalidad.nombre ||
        enc.destino.nombre === selectedLocalidad.nombre
    )
  }, [encomiendas, selectedLocalidad])

  // Handlers
  const handleViewDetails = (encomienda: EncomiendaRich) => {
    setSelectedEncomiendaView(encomienda)
    setIsDetailOpen(true)
  }

  const handleEditEncomienda = async (encomienda: EncomiendaRich) => {
    const encomiendaCompleta = await getEncomiendaById(encomienda.id);
    console.log('Fetch en : ', encomiendaCompleta)
    if (encomiendaCompleta) {
      setEditingEncomienda(encomiendaCompleta);
      setIsEditOpen(true);
    }
  };

  const handleDeleteEncomienda = (id: number) => {
    deleteEncomienda(id)
  }

  const handleUpdateEncomienda = async (data: any) => {
    if (!editingEncomienda) return

    await updateEncomienda(editingEncomienda.id, data)

    const formatted = selectedDate.toISOString().split("T")[0]
    const localidadId = selectedLocalidad === "Todas" ? undefined : selectedLocalidad.id
    const refreshed = await getByDate(formatted, localidadId)
    setEncomiendasByDate(refreshed)
  }

  // 🔵 Estado para encomiendas filtradas por fecha
  const [encomiendasByDate, setEncomiendasByDate] = useState<EncomiendaRich[]>([])
  const [loadingEncomiendas, setLoadingEncomiendas] = useState(false)

  useEffect(() => {
    const f = async () => {
      if (localidades.length === 0 || clientes.length === 0 || choferes.length === 0) {
        return
      }

      setLoadingEncomiendas(true)
      try {
        const formatted = selectedDate.toISOString().split("T")[0];
        const localidadId = selectedLocalidad === "Todas" ? undefined : selectedLocalidad.id;
        const data = await getByDate(formatted, localidadId);
        setEncomiendasByDate(data);
      } finally {
        setLoadingEncomiendas(false)
      }
    };

    f();
  }, [selectedDate, selectedLocalidad, localidades.length, clientes.length, choferes.length]);

  const filteredEncomiendasByDate = useMemo(() => {
    if (selectedLocalidad === "Todas") return encomiendasByDate

    return encomiendasByDate.filter(
      (enc) =>
        enc.origen.nombre === selectedLocalidad.nombre ||
        enc.destino.nombre === selectedLocalidad.nombre
    )
  }, [encomiendasByDate, selectedLocalidad])

  const monthlyAnalytics = useMemo(
    () => buildMonthlyDestinationAnalytics(encomiendas),
    [encomiendas]
  )


  return (
    <div className="min-h-screen">

      {/* Sidebar Mobile */}
      {(usuario?.rol === "superUsuario" || usuario?.rol === "administrador") && (
        <Sidebar
          onAddEncomienda={() => setIsAddEncomiendaOpen(true)}
          onAddCliente={() => setIsAddClienteOpen(true)}
          onAddChofer={() => setIsAddChoferOpen(true)}
          onAddDestino={() => setIsAddDestinoOpen(true)}
          onShowHistorial={() => setIsHistoryOpen(true)}
          onShowBuscador={() => setIsSearchOpen(true)}
          onViewClientes={() => setIsViewClientesOpen(true)}
          onViewChoferes={() => setIsViewChoferesOpen(true)}
          onViewDestinos={() => setIsViewDestinosOpen(true)}
          onShowFacturacion={() => setIsFacturacionOpen(true)}
          onShowAnalytics={() => setIsMonthlyAnalyticsOpen(true)}
          open={menuOpen}
          onOpenChange={setMenuOpen}
        />
      )}

      {/* Sidebar Desktop */}
      {usuario?.rol !== "chofer" && (
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
          onShowFacturacion={() => setIsFacturacionOpen(true)}
          onShowAnalytics={() => setIsMonthlyAnalyticsOpen(true)}
          open={menuOpen}
          onOpenChange={setMenuOpen}
        />
      )}
      {/* Main Content */}
      <div className="md:pl-64">
        {/* Header */}
        <DashboardHeader
          onOpenMenu={() => setMenuOpen(!menuOpen)}
          //onOpenMenu={() => setMenuOpen(true)}
        />

        {/* Dashboard Content */}
        <div className="container mx-auto p-4 space-y-8">
          {isMonthlyAnalyticsOpen ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-[0.2em]">Panel administrativo</p>
                  <h1 className="text-2xl font-bold text-slate-900">Analíticas mensuales</h1>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsMonthlyAnalyticsOpen(false)}
                >
                  Volver al dashboard
                </Button>
              </div>

              <MonthlyAnalyticsView metrics={monthlyAnalytics} />
            </div>
          ) : (
            <>
              <StatsCards encomiendas={filteredEncomiendasByDate} />

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <DateFilter
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />

                <ExportarExcelButton
                  encomiendas={encomiendasByDate}
                  localidad={localidades}
                />

                <Filterlocalidades
                  localidades={localidades}
                  selectedLocalidad={selectedLocalidad}
                  onLocalidadChange={setSelectedLocalidad}
                />
              </div>

              <EncomiendasTable
                encomiendasData={filteredEncomiendasByDate}
                onViewDetails={handleViewDetails}
                onEdit={handleEditEncomienda}
                onDelete={handleDeleteEncomienda}
              />

              {loadingEncomiendas && (
                <div className="text-sm text-muted-foreground">Cargando encomiendas...</div>
              )}
            </>
          )}
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
        encomiendas={encomiendas}
        onViewDetails={handleViewDetails}
      />

      <HistoryModal
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        encomiendas={encomiendas}
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

      <PadreFacturacion
        isAddOpen={isFacturacionOpen}
        onAddClose={() => setIsFacturacionOpen(false)}
        isViewOpen={isFacturacionOpen}
        onViewClose={() => setIsFacturacionOpen(false)}
        onOpenAdd={() => setIsFacturacionOpen(true)}
      />

    </div>
  )
}
