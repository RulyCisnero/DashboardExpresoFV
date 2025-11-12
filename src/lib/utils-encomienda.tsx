import type { EncomiendaView } from "../types/encomienda"

export function generateEncomiendaCode(): string {
  const prefix = "ENC"
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${prefix}-${timestamp}-${random}`
}

export function getEstadoColor(estado: string): string {
  switch (estado) {
    case "Pendiente":
      return "bg-yellow-100 text-yellow-800"
    case "En tránsito":
      return "bg-blue-100 text-blue-800"
    case "Entregado":
      return "bg-green-100 text-green-800"
    case "Cancelado":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

type BadgeVariant = "default" | "secondary" | "success" | "destructive" | "bg-yellow-100 text-yellow-800"
export function getEstadoBadgeVariant(estado: string): BadgeVariant {
  switch (estado) {
    case "Pendiente":
      return "bg-yellow-100 text-yellow-800" //SECONDARY
    case "En tránsito":
      return "default"
    case "Entregada":
      return "success"
    case "Cancelado":
      return "destructive"
    default:
      return "secondary"
  }
}

export function getEstadoStats(encomiendas: EncomiendaView[]) {
  const total = encomiendas.length
  const pendientes = encomiendas.filter((e) => e.estado === "Pendiente").length
  const enTransito = encomiendas.filter((e) => e.estado === "En tránsito").length
  const entregadas = encomiendas.filter((e) => e.estado === "Entregada").length
  const canceladas = encomiendas.filter((e) => e.estado === "Cancelado").length

  return {
    total,
    pendientes,
    enTransito,
    entregadas,
    canceladas,
  }
}

export function formatCurrency(amount: string): string {
  const numericAmount = Number.parseFloat(amount.replace(/[^0-9.-]+/g, ""))
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(numericAmount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

export function calculateDeliveryDate(fechaEnvio: string, dias = 3): string {
  const envio = new Date(fechaEnvio)
  envio.setDate(envio.getDate() + dias)
  return envio.toISOString().split("T")[0]
}

export function validateEncomiendaData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.remitente?.trim()) {
    errors.push("El nombre del remitente es requerido")
  }

  if (!data.destinatario?.trim()) {
    errors.push("El nombre del destinatario es requerido")
  }

  if (!data.origen?.trim()) {
    errors.push("El origen es requerido")
  }

  if (!data.destino?.trim()) {
    errors.push("El destino es requerido")
  }

  if (!data.peso || Number.parseFloat(data.peso) <= 0) {
    errors.push("El peso debe ser mayor a 0")
  }

  if (!data.precio || Number.parseFloat(data.precio) <= 0) {
    errors.push("El precio debe ser mayor a 0")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
