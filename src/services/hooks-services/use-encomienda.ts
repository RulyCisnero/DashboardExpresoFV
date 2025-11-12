import { useState, useEffect } from "react"
import type { Encomienda, EncomiendaForInput, EncomiendaFormData } from "../../types/encomienda"
import { EncomiendaService } from "../encomienda"
import { toast } from "../../hooks/use-toast"


export const useEncomienda = () => {
  //const [encomiendasApi, setEncomiendasApi] = useState<Encomienda[]>([])
  const [encomiendasApi, setEncomiendasApi] = useState<Encomienda[]>([])
  const [loadingEncomiendas, setLoadingEncomiendas] = useState(true)
  const [errorEncomienda, setErrorEncomienda] = useState<string | null>(null)

  const loadEncomiendas = async () => {
    setLoadingEncomiendas(true)
    try {
      const data = await EncomiendaService.getAllEncomiendas()
      setEncomiendasApi(data)
      setErrorEncomienda(null)
    } catch (e) {
      setErrorEncomienda("No se pudieron cargar los datos")
      console.error(e)
    } finally {
      setLoadingEncomiendas(false)
    }
  }

  const addNewEncomienda = async (data: EncomiendaForInput) => {
    try {
      const nuevaEncomienda = await EncomiendaService.addNewEncomienda(data)
      setEncomiendasApi((prev) => [...prev, nuevaEncomienda])
      toast({
        title: "Encomienda Agregada",
        description: "La nueva encomienda ha sido registrado exitosamente.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la encomienda.",
        variant: "destructive",
      })
      console.error("Error agregando encomienda:", error)
    }
  }

  const updateEncomienda = async (id: number, data: EncomiendaFormData) => {
    try {
      const updated = await EncomiendaService.updateEncomienda(id, data)
      setEncomiendasApi((prev) =>
        prev.map((encomienda) => (encomienda.id === id ? updated : encomienda))
      )

      toast({
        title: "Encomienda Actualizada",
        description: "Los cambios se guardaron correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la encomienda.",
        variant: "destructive",
      })
      console.error("Error actualizando encomienda:", error)
    }
  }


  const deleteEncomienda = async (encomienda: Encomienda) => {
    try {
      await EncomiendaService.deleteEncomienda(encomienda.id)
      setEncomiendasApi((prev) => prev.filter((e) => e.id !== encomienda.id))
      toast({
        title: "Encomienda eliminada",
        description: `Se eliminó la encomienda: "${encomienda.id}".`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la encomienda.",
        variant: "destructive",
      })
      console.error("Error eliminando encomienda:", error)
    }
  }



  useEffect(() => {
    loadEncomiendas()
  }, [])

  return {
    encomiendasApi,
    loadingEncomiendas,
    errorEncomienda,
    reload: loadEncomiendas,
    addNewEncomienda,
    updateEncomienda,
    deleteEncomienda
  }
}
