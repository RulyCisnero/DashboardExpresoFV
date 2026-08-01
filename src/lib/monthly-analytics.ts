import type { EncomiendaRich } from "../types/encomienda"

export interface MonthlyDestinationMetric {
  month: string
  monthLabel: string
  destino: string
  encomiendas: number
  ingreso: number
  year: number
  monthNumber: number
}

export interface MonthlyAnalyticsFilters {
  month?: string
  destino?: string
}

export function buildMonthlyDestinationAnalytics(
  encomiendas: EncomiendaRich[],
  filters: MonthlyAnalyticsFilters = {},
): MonthlyDestinationMetric[] {
  const byKey = new Map<string, MonthlyDestinationMetric>()

  for (const item of encomiendas) {
    const destinoNombre = item.destino?.nombre || "Sin destino"

    if (filters.destino && filters.destino !== "Todos" && destinoNombre !== filters.destino) {
      continue
    }

    const fecha = item.fecha_creacion ? new Date(item.fecha_creacion) : null
    if (!fecha || Number.isNaN(fecha.getTime())) continue

    const year = fecha.getFullYear()
    const monthNumber = fecha.getMonth() + 1
    const month = `${year}-${String(monthNumber).padStart(2, "0")}`

    if (filters.month && filters.month !== "Todos" && filters.month !== month) {
      continue
    }

    const monthLabel = fecha.toLocaleDateString("es-AR", {
      month: "long",
      year: "numeric",
    })

    const key = `${month}|${destinoNombre}`
    const current = byKey.get(key)
    const ingreso = Number(item.precio ?? 0)

    if (current) {
      current.encomiendas += 1
      current.ingreso += ingreso
    } else {
      byKey.set(key, {
        month,
        monthLabel,
        destino: destinoNombre,
        encomiendas: 1,
        ingreso,
        year,
        monthNumber,
      })
    }
  }

  return Array.from(byKey.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    if (a.monthNumber !== b.monthNumber) return a.monthNumber - b.monthNumber
    return a.destino.localeCompare(b.destino)
  })
}
