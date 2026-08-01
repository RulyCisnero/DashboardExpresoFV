"use client"

import { useMemo, useState } from "react"
import ExcelJS from "exceljs"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { TrendingUp, BarChart3, DollarSign, Filter, Download } from "lucide-react"

export interface MonthlyDestinationMetric {
  month: string
  monthLabel: string
  destino: string
  encomiendas: number
  ingreso: number
  year: number
  monthNumber: number
}

interface MonthlyAnalyticsViewProps {
  metrics: MonthlyDestinationMetric[]
}

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
})

export function MonthlyAnalyticsView({ metrics }: MonthlyAnalyticsViewProps) {
  const [selectedYear, setSelectedYear] = useState("Todos")
  const [selectedMonth, setSelectedMonth] = useState("Todos")
  const [selectedDestino, setSelectedDestino] = useState("Todos")

  const yearOptions = useMemo(() => {
    const uniqueYears = Array.from(new Set(metrics.map((item) => String(item.year)))).sort((a, b) => Number(a) - Number(b))
    return uniqueYears.map((year) => ({ value: year, label: year }))
  }, [metrics])

  const monthOptions = useMemo(() => {
    const filteredByYear = metrics.filter((item) => selectedYear === "Todos" || String(item.year) === selectedYear)
    const uniqueMonths = Array.from(new Set(filteredByYear.map((item) => item.month))).sort((a, b) => a.localeCompare(b))
    return uniqueMonths.map((month) => {
      const match = filteredByYear.find((item) => item.month === month)
      return {
        value: month,
        label: match?.monthLabel ?? month,
      }
    })
  }, [metrics, selectedYear])

  const destinoOptions = useMemo(() => {
    const filteredByYear = metrics.filter((item) => selectedYear === "Todos" || String(item.year) === selectedYear)
    const uniqueDestinos = Array.from(new Set(filteredByYear.map((item) => item.destino))).sort((a, b) => a.localeCompare(b))
    return uniqueDestinos
  }, [metrics, selectedYear])

  const filteredMetrics = useMemo(() => {
    return metrics.filter((item) => {
      const matchesYear = selectedYear === "Todos" || String(item.year) === selectedYear
      const matchesMonth = selectedMonth === "Todos" || item.month === selectedMonth
      const matchesDestino = selectedDestino === "Todos" || item.destino === selectedDestino
      return matchesYear && matchesMonth && matchesDestino
    })
  }, [metrics, selectedYear, selectedMonth, selectedDestino])

  const chartData = useMemo(() => {
    const byMonth = new Map<string, number>()
    for (const item of filteredMetrics) {
      byMonth.set(item.month, (byMonth.get(item.month) ?? 0) + item.ingreso)
    }

    const entries = Array.from(byMonth.entries()).map(([month, ingreso]) => {
      const match = metrics.find((item) => item.month === month)
      return {
        month,
        label: match?.monthLabel ?? month,
        ingreso,
      }
    })

    return entries.sort((a, b) => a.month.localeCompare(b.month))
  }, [filteredMetrics, metrics])

  const monthComparison = useMemo(() => {
    if (!filteredMetrics.length) return null

    const aggregatedByMonth = new Map<string, number>()
    for (const item of filteredMetrics) {
      aggregatedByMonth.set(item.month, (aggregatedByMonth.get(item.month) ?? 0) + item.ingreso)
    }

    const orderedMonths = Array.from(aggregatedByMonth.entries()).sort((a, b) => a[0].localeCompare(b[0]))
    if (orderedMonths.length < 2) return null

    const latest = orderedMonths[orderedMonths.length - 1][1]
    const previous = orderedMonths[orderedMonths.length - 2][1]
    const delta = latest - previous
    const growth = previous === 0 ? 0 : (delta / previous) * 100

    return {
      latestMonth: orderedMonths[orderedMonths.length - 1][0],
      previousMonth: orderedMonths[orderedMonths.length - 2][0],
      latestValue: latest,
      previousValue: previous,
      delta,
      growth,
    }
  }, [filteredMetrics])

  const destinationShare = useMemo(() => {
    const byDestino = new Map<string, number>()
    for (const item of filteredMetrics) {
      byDestino.set(item.destino, (byDestino.get(item.destino) ?? 0) + item.ingreso)
    }

    const entries = Array.from(byDestino.entries()).map(([destino, ingreso]) => ({ destino, ingreso }))
    const total = entries.reduce((sum, item) => sum + item.ingreso, 0)

    return entries
      .map((item) => ({ ...item, share: total === 0 ? 0 : (item.ingreso / total) * 100 }))
      .sort((a, b) => b.ingreso - a.ingreso)
  }, [filteredMetrics])

  const maxChartValue = Math.max(...chartData.map((item) => item.ingreso), 1)

  const totalIngresos = filteredMetrics.reduce((sum, item) => sum + item.ingreso, 0)
  const totalEncomiendas = filteredMetrics.reduce((sum, item) => sum + item.encomiendas, 0)
  const promedioIngreso = filteredMetrics.length ? totalIngresos / filteredMetrics.length : 0
  const topDestino = filteredMetrics.reduce<{ destino: string; ingreso: number } | null>((best, item) => {
    if (!best || item.ingreso > best.ingreso) {
      return { destino: item.destino, ingreso: item.ingreso }
    }
    return best
  }, null)

  const handleExportAnalytics = async () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Analiticas")

    sheet.columns = [
      { header: "Mes", key: "mes", width: 22 },
      { header: "Destino", key: "destino", width: 22 },
      { header: "Encomiendas", key: "encomiendas", width: 16 },
      { header: "Ingreso", key: "ingreso", width: 18 },
    ]

    filteredMetrics.forEach((item) => {
      sheet.addRow({
        mes: item.monthLabel,
        destino: item.destino,
        encomiendas: item.encomiendas,
        ingreso: item.ingreso,
      })
    })

    sheet.getRow(1).font = { bold: true }
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E293B" },
    }
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `analiticas-mensuales-${new Date().toISOString().slice(0, 10)}.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-xl border border-slate-700 bg-slate-900/70 p-3">
        <div className="flex items-center gap-2 text-slate-200">
          <Filter className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium">Filtros</span>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="w-full md:w-40">
            <Select value={selectedYear} onValueChange={(value) => {
              setSelectedYear(value)
              setSelectedMonth("Todos")
            }}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-100">
                <SelectValue placeholder="Todos los años" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos los años</SelectItem>
                {yearOptions.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-52">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-100">
                <SelectValue placeholder="Todos los meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos los meses</SelectItem>
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-52">
            <Select value={selectedDestino} onValueChange={setSelectedDestino}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-100">
                <SelectValue placeholder="Todos los destinos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos los destinos</SelectItem>
                {destinoOptions.map((destino) => (
                  <SelectItem key={destino} value={destino}>
                    {destino}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="bg-emerald-600 hover:bg-emerald-500 text-white border-0"
            onClick={handleExportAnalytics}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              Ingreso total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{currency.format(totalIngresos)}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-sky-400" />
              Encomiendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalEncomiendas}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-violet-400" />
              Promedio / mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">{currency.format(promedioIngreso)}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              Mejor destino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">
              {topDestino ? topDestino.destino : "Sin datos"}
            </div>
            <div className="text-sm text-slate-400">
              {topDestino ? currency.format(topDestino.ingreso) : "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Comparación mes a mes</CardTitle>
          </CardHeader>
          <CardContent>
            {monthComparison ? (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <div className="text-sm text-slate-400">Mes actual</div>
                    <div className="text-xl font-bold text-white">{currency.format(monthComparison.latestValue)}</div>
                  </div>
                  <div className={`text-sm font-semibold ${monthComparison.delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {monthComparison.delta >= 0 ? "+" : ""}{currency.format(monthComparison.delta)}
                  </div>
                </div>
                <div className="text-sm text-slate-300">
                  vs {monthComparison.previousMonth}: {currency.format(monthComparison.previousValue)}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${monthComparison.growth >= 0 ? "bg-gradient-to-r from-emerald-500 to-cyan-400" : "bg-gradient-to-r from-rose-500 to-orange-400"}`}
                    style={{ width: `${Math.min(Math.abs(monthComparison.growth) * 4, 100)}%` }}
                  />
                </div>
                <div className={`text-sm font-medium ${monthComparison.growth >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {monthComparison.growth >= 0 ? "+" : ""}{monthComparison.growth.toFixed(1)}% respecto al mes anterior
                </div>
              </div>
            ) : (
              <div className="text-slate-400 py-6 text-center">Falta suficiente historial para comparar.</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Participación por destino</CardTitle>
          </CardHeader>
          <CardContent>
            {destinationShare.length === 0 ? (
              <div className="text-slate-400 py-6 text-center">Sin información por destino.</div>
            ) : (
              <div className="space-y-4">
                {destinationShare.map((item) => (
                  <div key={item.destino} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-200">{item.destino}</span>
                      <span className="text-slate-400">{item.share.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                        style={{ width: `${item.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Ingresos por mes</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="text-slate-400 py-6 text-center">No hay datos para graficar.</div>
          ) : (
            <div className="flex h-56 items-end gap-3 overflow-x-auto pb-2 pt-4">
              {chartData.map((item) => {
                const barHeight = `${(item.ingreso / maxChartValue) * 100}%`
                return (
                  <div key={item.month} className="flex min-w-[72px] flex-1 flex-col items-center gap-2">
                    <span className="text-[10px] text-slate-400">{currency.format(item.ingreso)}</span>
                    <div className="flex h-40 w-full items-end justify-center rounded-t-lg bg-slate-800 p-1">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-lg shadow-cyan-500/20"
                        style={{ height: barHeight }}
                        title={`${item.label}: ${currency.format(item.ingreso)}`}
                      />
                    </div>
                    <span className="text-center text-[10px] text-slate-300">{item.label.split(" ")[0]}</span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Ingresos por mes y destino</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMetrics.length === 0 ? (
            <div className="text-slate-400 py-8 text-center">
              No hay datos disponibles para los filtros seleccionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Mes</TableHead>
                    <TableHead className="text-slate-300">Destino</TableHead>
                    <TableHead className="text-slate-300">Encomiendas</TableHead>
                    <TableHead className="text-slate-300">Ingreso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMetrics.map((item) => (
                    <TableRow key={`${item.month}-${item.destino}`} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="text-white">{item.monthLabel}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-800 text-slate-200 border border-slate-700">
                          {item.destino}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{item.encomiendas}</TableCell>
                      <TableCell className="text-emerald-300 font-semibold">{currency.format(item.ingreso)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
