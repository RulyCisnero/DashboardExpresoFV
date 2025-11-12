import { useState, useEffect } from "react"
import type {  Cliente,  ClienteFormData , ClienteFormInput} from "../../types/encomienda"
import { ClienteService } from "../cliente"
import { toast } from "../../hooks/use-toast"

export const useCliente = () => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loadingClient, setLoadingClient] = useState(true)
  const [errorCliente, setErrorCliente] = useState<string | null>(null)

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    setLoadingClient(true)
    try {
      const data = await ClienteService.getAllClientes()
      setClientes(data)
      setErrorCliente(null)
    } catch (e) {
      setErrorCliente("No se pudieron cargar los datos")
      console.error(e)
    } finally {
      setLoadingClient(false)
    }
  }

  const addCliente = async (data: /* ClienteFormData */ClienteFormInput) => {
    try {
      const nuevoCliente = await ClienteService.addNewCliente(data)
      setClientes((prev) => [...prev, nuevoCliente])
      toast({
        title: "Cliente Agregado",
        description: "El nuevo cliente ha sido registrado exitosamente.",
        variant:"success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el cliente.",
        variant: "destructive",
      })
      console.error("Error agregando cliente:", error)
    }
  }

  const updateCliente = async (id: number, data: ClienteFormInput) => {
        try {
          const updated = await ClienteService.updateCliente(id, data)
          setClientes((prev) =>
            prev.map((cliente) => (cliente.id === id ? updated : cliente))
          )
          
          toast({
            title: "Cliente actualizado",
            description: "Los cambios se guardaron correctamente.",
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo actualizar el cliente.",
            variant: "destructive",
          })
          console.error("Error actualizando cliente:", error)
        }
      }
  

  const deleteCliente = async (cliente: Cliente) => {
    try {
      await ClienteService.deleteCliente(cliente.id) 
      setClientes((prev) => prev.filter((c) => c.id !== cliente.id))
      toast({
        title: "Cliente Eliminado",
        description: `Se eliminó el cliente: "${cliente.nombre} ${cliente.apellido}".`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente.",
        variant: "destructive",
      })
      console.error("Error eliminando cliente:", error)
    }
  }




  return {
    clientes,
    loadingClient,
    errorCliente,
    reloadClientes: loadClientes,
    addCliente,
    deleteCliente,
    updateCliente
  }
}
