import React from 'react';
import { 
  FileText, DollarSign, AlertCircle, CheckCircle, 
  Download, Eye, Search, Plus, Calendar 
} from 'lucide-react';

const FacturacionDashboard = () => {
  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans">
      
      {/* SIMULACIÓN DE TU SIDEBAR ACTUAL */}
      <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-white font-bold text-lg">Menú Principal</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {/* ... tus otros items ... */}
          <a href="#" className="flex items-center px-4 py-3 text-slate-400 hover:text-white rounded-lg">
            <span className="mr-3">📦</span> Agregar Encomienda
          </a>
          <div className="h-px bg-slate-800 my-4"></div>
          {/* NUEVO ITEM DE FACTURACIÓN (Activo) */}
          <a href="#" className="flex items-center px-4 py-3 bg-slate-800 text-white rounded-lg border-l-2 border-emerald-500">
            <FileText size={18} className="mr-3 text-emerald-500" />
            Facturación AFIP
          </a>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Encabezado */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Módulo de Facturación</h2>
            <p className="text-sm text-slate-400 mt-1">Gestiona comprobantes electrónicos, CAEs y facturación mensual.</p>
          </div>
          <div className="flex items-center space-x-4">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                A
             </div>
          </div>
        </header>

        {/* Tarjetas de Métricas (KPIs) */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 mb-1">Total Facturado (Mes)</p>
                <h3 className="text-2xl font-bold text-white">$ 1,450,000</h3>
              </div>
              <DollarSign className="text-slate-500" size={20} />
            </div>
            <p className="text-xs text-emerald-400 mt-3">+12% vs mes anterior</p>
          </div>

          <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 mb-1">Facturas Emitidas</p>
                <h3 className="text-2xl font-bold text-white">142</h3>
              </div>
              <FileText className="text-slate-500" size={20} />
            </div>
            <p className="text-xs text-slate-500 mt-3">Comprobantes tipo A y C</p>
          </div>

          <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 mb-1">Aprobadas (AFIP)</p>
                <h3 className="text-2xl font-bold text-emerald-500">140</h3>
              </div>
              <CheckCircle className="text-emerald-500" size={20} />
            </div>
            <p className="text-xs text-slate-500 mt-3">Con CAE asignado</p>
          </div>

          <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 mb-1">Errores / Rechazadas</p>
                <h3 className="text-2xl font-bold text-rose-500">2</h3>
              </div>
              <AlertCircle className="text-rose-500" size={20} />
            </div>
            <p className="text-xs text-slate-500 mt-3">Revisar CUITs inválidos</p>
          </div>
        </div>

        {/* Barra de Acciones */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-3">
            <button className="bg-slate-800 border border-slate-700 text-sm px-4 py-2 rounded-lg flex items-center hover:bg-slate-700 transition">
              <Calendar size={16} className="mr-2" />
              Julio 2026
            </button>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar por cliente o Nro..." 
                className="bg-slate-800 border border-slate-700 text-sm pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-emerald-500 text-white w-64"
              />
            </div>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-5 py-2.5 rounded-lg flex items-center transition shadow-lg shadow-emerald-900/20">
            <Plus size={18} className="mr-2" />
            Nueva Factura
          </button>
        </div>

        {/* Tabla Principal */}
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-700/50">
            <h3 className="text-white font-medium">Historial de Comprobantes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Comprobante</th>
                  <th className="px-6 py-4 font-medium">Cliente</th>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                  <th className="px-6 py-4 font-medium">Monto</th>
                  <th className="px-6 py-4 font-medium">Estado AFIP</th>
                  <th className="px-6 py-4 font-medium">CAE</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-700/50">
                
                {/* FILA 1 - APROBADA */}
                <tr className="hover:bg-slate-800/30 transition">
                  <td className="px-6 py-4 font-medium text-white">Factura A - 0001-00000452</td>
                  <td className="px-6 py-4">
                    <div className="text-white">Distribuidora del Sur</div>
                    <div className="text-xs text-slate-500">CUIT: 30-12345678-9</div>
                  </td>
                  <td className="px-6 py-4">29/07/2026</td>
                  <td className="px-6 py-4 font-medium text-white">$102,850.00</td>
                  <td className="px-6 py-4">
                    <span className="bg-white text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      Aprobada
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300">73324567891234</div>
                    <div className="text-xs text-slate-500">Vto: 08/08/2026</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2 text-slate-400">
                      <button className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition" title="Ver PDF">
                        <Eye size={18} />
                      </button>
                      <button className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition" title="Descargar PDF">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* FILA 2 - PENDIENTE / ERROR */}
                <tr className="hover:bg-slate-800/30 transition">
                  <td className="px-6 py-4 font-medium text-white">Factura C - 0001-00000453</td>
                  <td className="px-6 py-4">
                    <div className="text-white">Juan Pérez</div>
                    <div className="text-xs text-slate-500">CUIT: 20-45678912-3</div>
                  </td>
                  <td className="px-6 py-4">29/07/2026</td>
                  <td className="px-6 py-4 font-medium text-white">$15,500.00</td>
                  <td className="px-6 py-4">
                    <span className="bg-rose-950 text-rose-400 border border-rose-800 px-3 py-1 rounded-full text-xs font-bold">
                      Rechazada
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs italic">
                    Sin asignar
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2 text-slate-400">
                      <button className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition text-xs flex items-center">
                         Ver Error
                      </button>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default FacturacionDashboard;