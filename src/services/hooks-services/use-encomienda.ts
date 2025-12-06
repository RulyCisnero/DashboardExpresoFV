import { useState, useEffect } from "react"
import type { EncomiendaInput, EncomiendaRich, EncomiendaUpdate } from "../../types/encomienda"
import { EncomiendaService } from "../encomienda"
import { toast } from "../../hooks/use-toast"


export const useEncomienda = () => {
  const [encomiendas, setEncomiendas] = useState<EncomiendaRich[]>([])
  const [loadingEncomiendas, setLoadingEncomiendas] = useState(true)
  const [errorEncomienda, setErrorEncomienda] = useState<string | null>(null)

  const loadEncomiendas = async () => {
    setLoadingEncomiendas(true)
    try {
      const data = await EncomiendaService.getAll()
      setEncomiendas(data)
      setErrorEncomienda(null)
    } catch (e) {
      setErrorEncomienda("No se pudieron cargar los datos")
      console.error(e)
    } finally {
      setLoadingEncomiendas(false)
    }
  }

  const addNewEncomienda = async (data: EncomiendaInput) => {
    try {
      // 1️⃣ Primero creás la encomienda mínima (solo IDs)
      const nueva = await EncomiendaService.create(data)
      // 2️⃣ Luego pedís la encomienda completa ya enriquecida
      const completa = await EncomiendaService.getById(nueva.id)
      // 3️⃣ Guardás la COMPLETA en tu estado
      setEncomiendas(prev => [...prev, completa])
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
  const getEncomiendaById = async (id: number): Promise<EncomiendaRich | null> => {
    try {
      const encomienda = await EncomiendaService.getById(id);
      return encomienda;
    } catch (error) {
      console.error("Error obteniendo encomienda:", error);
      return null;
    }
  };

  const updateEncomienda = async (id: number, data: EncomiendaUpdate) => {
    try {
      // 1️⃣ Actualizar
      await EncomiendaService.update(id, data)

      // 2️⃣ Traer versión enriquecida
      const completa = await EncomiendaService.getById(id)

      // 3️⃣ Guardarla
      setEncomiendas(prev =>
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

  const deleteEncomienda = async (id: number) => {
    try {
      await EncomiendaService.delete(id)
      setEncomiendas((prev) => prev.filter((e) => e.id !== id))
      toast({
        title: "Encomienda eliminada",
        description: `Se eliminó la encomienda: "${id}".`,
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
    encomiendas,
    loadingEncomiendas,
    errorEncomienda,
    reload: loadEncomiendas,
    addNewEncomienda,
    getEncomiendaById,
    updateEncomienda,
    deleteEncomienda
  }
}
