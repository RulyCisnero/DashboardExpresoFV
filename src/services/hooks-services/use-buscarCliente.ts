import { useState } from "react"
import type { Cliente } from "../../types/encomienda"
import { ClienteService } from "../cliente"

export const useBuscarCliente = () => {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loadingBuscar, setLoadingBuscar] = useState(false)
  const [errorBuscar, setErrorBuscar] = useState<string | null>(null)

  const searchCliente = async (id: number) => {
    try {
      setLoadingBuscar(true)
      setErrorBuscar(null)

      const data = await ClienteService.searchCliente(id)
      setCliente(data)

      return data
    } catch (error) {
      setErrorBuscar("No se encontró el cliente")
      console.error(error)
      throw error
    } finally {
      setLoadingBuscar(false)
    }
  }

  return {
    cliente,
    loadingBuscar,
    errorBuscar,
    searchCliente
  }
}
