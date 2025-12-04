import { useState } from "react"
import type { Encomienda } from "../../types/encomienda"
import { EncomiendaService } from "../encomienda"

export const useEncomiendasPorCliente = () => {
  const [encomiendas, setEncomiendas] = useState<Encomienda[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadByCliente = async (clienteId: number) => {
    try {
      setLoading(true)
      setError(null)

      const data = await EncomiendaService.getEncomiendaById(clienteId)
      setEncomiendas(data)

      return data
    } catch (err) {
      setError("No se pudieron cargar las encomiendas.")
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    encomiendas,
    loading,
    error,
    loadByCliente,
  }
}
