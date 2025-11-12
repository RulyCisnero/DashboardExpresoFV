"use client"

import { useState } from "react"
import { initialEncomiendas, initialClientes, initialChoferes, initialDestinos } from "../data/initial-data"
import { generateEncomiendaCode, calculateDeliveryDate } from "./../lib/utils-encomienda"
import { toast } from "../hooks/use-toast"
import type {
  Encomienda,
  Cliente,
  Chofer,
  Destino,
  EncomiendaFormData,
  ClienteFormData,
  ChoferFormData,
  DestinoFormData,
} from "../types/encomienda"

/**
 * Hook personalizado para manejar encomiendas
 */
export const useEncomiendas = () => {
  const [encomiendas, setEncomiendas] = useState<Encomienda[]>(initialEncomiendas)
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes)
  const [choferes, setChoferes] = useState<Chofer[]>(initialChoferes)
  const [destinos, setDestinos] = useState<Destino[]>(initialDestinos)

  /**
   * Agrega una nueva encomienda
   */
  const addEncomienda = (data: EncomiendaFormData) => {
    const newId = encomiendas.length + 1
    const newEncomienda: Encomienda = {
      id: newId,
      codigo: generateEncomiendaCode(newId),
      ...data,
      estado: "Pendiente",
      fechaEntrega: calculateDeliveryDate(data.fechaEnvio),
      chofer: getAvailableChofer(),
    }

    setEncomiendas((prev) => [...prev, newEncomienda])
    toast({
      title: "Encomienda creada",
      description: `La encomienda ${newEncomienda.codigo} ha sido registrada exitosamente.`,
    })
  }

  /**
   * Actualiza una encomienda existente
   */
  const updateEncomienda = (id: number, data: Partial<EncomiendaFormData>) => {
    setEncomiendas((prev) => prev.map((enc) => (enc.id === id ? { ...enc, ...data } : enc)))
    toast({
      title: "Encomienda actualizada",
      description: "Los datos de la encomienda han sido actualizados exitosamente.",
    })
  }

  /**
   * Elimina una encomienda
   */
  const deleteEncomienda = (id: number) => {
    setEncomiendas((prev) => prev.filter((enc) => enc.id !== id))
    toast({
      title: "Encomienda eliminada",
      description: "La encomienda ha sido eliminada exitosamente.",
    })
  }

  /**
   * Agrega un nuevo cliente
   */
  const addCliente = (data: ClienteFormData) => {
    const newCliente: Cliente = {
      id: clientes.length + 1,
      ...data,
    }

    setClientes((prev) => [...prev, newCliente])
    toast({
      title: "Cliente agregado",
      description: "El nuevo cliente ha sido registrado exitosamente.",
    })
  }

  /**
   * Agrega un nuevo chofer
   */
  const addChofer = (data: ChoferFormData) => {
    const newChofer: Chofer = {
      id: choferes.length + 1,
      ...data,
      estado: "Activo",
    }

    setChoferes((prev) => [...prev, newChofer])
    toast({
      title: "Chofer agregado",
      description: "El nuevo chofer ha sido registrado exitosamente.",
    })
  }

  /**
   * Agrega un nuevo destino
   */
  const addDestino = (data: DestinoFormData) => {
    const newDestino: Destino = {
      id: destinos.length + 1,
      ...data,
      activo: true,
    }

    setDestinos((prev) => [...prev, newDestino])
    toast({
      title: "Destino agregado",
      description: "El nuevo destino ha sido registrado exitosamente.",
    })
  }

  // Helper function
  const getAvailableChofer = (): string => {
    const activeChoferes = choferes.filter((c) => c.estado === "Activo")
    if (activeChoferes.length === 0) return "Sin asignar"

    // Simple round-robin assignment
    const randomIndex = Math.floor(Math.random() * activeChoferes.length)
    return activeChoferes[randomIndex].nombre
  }

  return {
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
  }
}
