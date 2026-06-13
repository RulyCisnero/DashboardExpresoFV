
import { type Localidad, type LocalidadFormData } from "../types/encomienda"
import { apiFetch } from "./apiClient.ts"

const API_URL = "http://localhost:5100/api/localidades"

export const LocalidadesService = {

  async getAll(): Promise<Localidad[]> {
    const res = await apiFetch(API_URL)
    if (!res.ok) throw new Error("Error al cargar localidades")
    return res.json()
  },

  async addNewLocalidad(data: LocalidadFormData): Promise<Localidad> {
    const res = await apiFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al crear localidad")
    }
    const nuevaLocalidad: Localidad = await res.json()
    return nuevaLocalidad
  },

  async updateLocalidad(id: number, data: LocalidadFormData): Promise<Localidad> {
    const res = await apiFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al actualizar localidad")
    }

    return res.json()
  },

  async deleteLocalidad(id: number): Promise<void> {
    const res = await apiFetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || "Error al eliminar localidad desde services ")
    }
  },
}
