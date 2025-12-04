import { useEffect, useState, useCallback } from "react"
import { type Localidad, type LocalidadFormData } from "../../types/encomienda"
import { LocalidadesService } from "../localidades"
import { toast } from "../../hooks/use-toast"

export const useLocalidades = () => {
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [loadingLocalidad, setLoadingLocalidad] = useState(true)
  const [errorLocalidad, setErrorLocalidad] = useState<string | null>(null)

  /*   const loadLocalidades = async () => {
     setLoadingLocalidad(true)
     try {
       const data = await LocalidadesService.getAll()
       setLocalidades(data)
       setErrorLocalidad(null)
     } catch (e) {
       setErrorLocalidad("No se pudieron cargar las localidades")
       console.log(e)
     } finally {
       setLoadingLocalidad(false)
     }
   }  */

  const loadLocalidades = useCallback(async () => {
    setLoadingLocalidad(true)
    try {
      const data = await LocalidadesService.getAll()
      setLocalidades(Array.isArray(data) ? data : []) // ✅ Validación extra
      setErrorLocalidad(null)
    } catch (e) {
      console.error("Error cargando localidades:", e)
      setErrorLocalidad("No se pudieron cargar las localidades")
      setLocalidades([]) // ✅ Garantizamos que siempre haya un array
    } finally {
      setLoadingLocalidad(false)
    }
  }, [])
  

  /*  const loadLocalidades = useCallback(async () => {
     setLoadingLocalidad(true)
     try {
       const data = await LocalidadesService.getAll()
       setLocalidades(data)
       setErrorLocalidad(null)
     } catch {
       setErrorLocalidad("No se pudieron cargar las localidades")
     } finally {
       setLoadingLocalidad(false)
     }
   }, []) */

  const addLocalidad = async (data: LocalidadFormData) => {
    try {
      const nuevaLocalidad = await LocalidadesService.addNewLocalidad(data)
      setLocalidades((prev) => [...prev, nuevaLocalidad])
      toast({
        title: "Localidad agregada",
        description: "La nueva localidad ha sido registrada exitosamente.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la localidad.",
        variant: "destructive",
      })
      console.error("Error agregando localidad:", error)
    }
  }

  const updateLocalidad = async (id: number, data: LocalidadFormData) => {
    try {
      const updated = await LocalidadesService.updateLocalidad(id, data)
      setLocalidades((prev) =>
        prev.map((loc) => (loc.id === id ? updated : loc))
      )

      toast({
        title: "Localidad actualizada",
        description: "Los cambios se guardaron correctamente.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la localidad.",
        variant: "destructive",
      })
      console.error("Error actualizando localidad:", error)
    }
  }

  const deleteLocalidad = async (localidad: Localidad) => {
    try {
      await LocalidadesService.deleteLocalidad(localidad.id) // si tu servicio recibe el objeto completo
      setLocalidades((prev) => prev.filter((l) => l.id !== localidad.id))
      toast({
        title: "Localidad eliminada",
        description: `Se eliminó la localidad "${localidad.nombre}".`,
        variant: "info"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la localidad.",
        variant: "destructive",
      })
      console.error("Error eliminando localidad:", error)
    }
  }

  useEffect(() => {
    loadLocalidades()
  }, [loadLocalidades])


  return {
    localidades,
    loadingLocalidad,
    errorLocalidad,
    reloadLocalidades: loadLocalidades,
    addLocalidad,
    deleteLocalidad,
    updateLocalidad,
  }
}