import { useState, useEffect } from "react"
import type { Encomienda, EncomiendaForInput, EncomiendaFormData, EncomiendaInput, EncomiendaTable } from "../../types/encomienda"
import { EncomiendaService } from "../encomienda"
import { toast } from "../../hooks/use-toast"


export const useEncomienda = () => {
  //const [encomiendasApi, setEncomiendasApi] = useState<Encomienda[]>([])
  const [encomiendasApi, setEncomiendasApi] = useState<EncomiendaTable[]>([])
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

  const addNewEncomienda = async (data: EncomiendaInput /* EncomiendaForInput */) => {
    try {
      // 1️⃣ Primero creás la encomienda mínima (solo IDs)
      const nueva = await EncomiendaService.addNewEncomienda(data)
      // 2️⃣ Luego pedís la encomienda completa ya enriquecida
      const completa = await EncomiendaService.getEncomiendaById(nueva.id)
      // 3️⃣ Guardás la COMPLETA en tu estado
      setEncomiendasApi(prev => [...prev, completa])
      //const nuevaEncomienda = await EncomiendaService.addNewEncomienda(data)
      //setEncomiendasApi((prev) => [...prev, nuevaEncomienda])
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
  const getEncomiendaById = async (id: number): Promise<Encomienda | null> => {
    try {
      const encomienda = await EncomiendaService.getEncomiendaById(id);
      return encomienda;
    } catch (error) {
      console.error("Error obteniendo encomienda:", error);
      return null;
    }
  };


  /*   const updateEncomienda = async (id: number, data: EncomiendaFormData) => {
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
   */
  const updateEncomienda = async (id: number, data: EncomiendaFormData) => {
    try {
      // 1️⃣ Actualizar
      await EncomiendaService.updateEncomienda(id, data)

      // 2️⃣ Traer versión enriquecida
      const completa = await EncomiendaService.getEncomiendaById(id)

      // 3️⃣ Guardarla
      setEncomiendasApi(prev =>
        prev.map(e => (e.id === id ? completa : e))
      )

      toast({
        title: "Encomienda Actualizada",
        description: "Los cambios se guardaron correctamente.",
        variant: "success"
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
        variant: "success"
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
    getEncomiendaById,
    updateEncomienda,
    deleteEncomienda
  }
}
