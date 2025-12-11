import { useState, useRef } from "react"
import type { Cliente } from "../../types/encomienda"
import { ClienteService } from "../cliente"

export const useBuscarCliente = () => {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [clientesEncontrados, setClientesEncontrados] = useState<Cliente[]>([])
  const [loadingBuscar, setLoadingBuscar] = useState(false)
  const [errorBuscar, setErrorBuscar] = useState<string | null>(null)
  const lastQueryRef = useRef<string>("");

  const searchCliente = async (query: string) => {
    if (lastQueryRef.current === query) return; //  evita loops
    lastQueryRef.current = query;
    try {
      setLoadingBuscar(true)
      setErrorBuscar(null)
      setCliente(null)
      setClientesEncontrados([])

      const data = await ClienteService.searchClienteTexto(query)

      if (data.length === 0) {
        setErrorBuscar("No se encontró el cliente")
        return null
      }

      if (data.length === 1) {
        setCliente(data[0])
        return data[0]
      }

      // si hay varios:
      setClientesEncontrados(data)
      return data

    } catch (error) {
      setErrorBuscar("Error al buscar cliente")
      throw error
    } finally {
      setLoadingBuscar(false)
    }
  }

  return {
    cliente,                // único cliente
    clientesEncontrados,    // lista de coincidencias
    loadingBuscar,
    errorBuscar,
    searchCliente
  }
}
