import { useEffect, useState } from "react"
import { type Chofer , type ChoferFormData } from "../../types/encomienda"
import { ChoferesService } from "../choferes"
import { toast } from "../../hooks/use-toast"

export const useChoferes = () => {
  const [choferes, setChoferes] = useState<Chofer[]>([])
  const [loadingChofer, setLoadingChofer] = useState(true)
  const [errorChofer, setErrorChofer] = useState<string | null>(null)

  useEffect(() => {
    loadChoferes()
  }, [])

  const loadChoferes = async () => {
    setLoadingChofer(true)
    try {
      const data = await ChoferesService.getAll()
      setChoferes(data)
      setErrorChofer(null)
    } catch (e) {
      setErrorChofer("No se pudieron cargar los choferes")
      console.log(e)
    } finally {
      setLoadingChofer(false)
    }
  }

   const addChofer = async (data: ChoferFormData) => {
    try {
      const nuevoChofer = await ChoferesService.addNewChofer(data)
      setChoferes((prev) => [...prev, nuevoChofer])
       toast({
        title: "Chofer agregado",
        description: "El nuevo chofer ha sido registrado exitosamente.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el chofer.",
        variant: "destructive",
      })
      console.error("Error agregando chofer:", error)
    }
  } 

  const updateChofer = async (id: number, data: ChoferFormData) => {
      try {
        const updated = await ChoferesService.updateChofer(id, data)
        setChoferes((prev) =>
          prev.map((chofer) => (chofer.id === id ? updated : chofer))
        )
        
        toast({
          title: "Chofer actualizado",
          description: "Los cambios se guardaron correctamente.",
          variant: "success"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar el chofer.",
          variant: "destructive",
        })
        console.error("Error actualizando chofer:", error)
      }
    }

  const deleteChofer = async (chofer: Chofer) => {
      try {
        await ChoferesService.deleteChofer(chofer.id) // si tu servicio recibe el objeto completo
        setChoferes((prev) => prev.filter((c) => c.id !== chofer.id))
        toast({
          title: "Chofer Eliminado",
          description: `Se eliminó el chofer: "${chofer.nombre}".`,
          variant: "success"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el chofer.",
          variant: "destructive",
        })
        console.error("Error eliminando chofer:", error)
      }
    }

  return {
    choferes,
    loadingChofer,
    errorChofer,
    reloadChoferes: loadChoferes,
    addChofer,
    deleteChofer,
    updateChofer
  } 
}