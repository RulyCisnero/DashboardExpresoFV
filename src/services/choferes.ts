import { type ChoferFormData, type Chofer } from "../types/encomienda"
import { apiFetch } from "./apiClient.ts"

const API_URL = "http://localhost:5100/api/choferes"

export const ChoferesService = {

  async getAll(): Promise<Chofer[]> {
    const res = await apiFetch(API_URL, { cache: "no-store" })
    if (!res.ok) throw new Error("Error al cargar choferes")
    return res.json()
  },

  async addNewChofer(data: ChoferFormData): Promise<Chofer> {
    const res = await apiFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al crear el Chofer")
    }
    const nuevoChofer: Chofer = await res.json()
    return nuevoChofer
  },

  async updateChofer(id: number, data: ChoferFormData): Promise<Chofer> {
    const res = await apiFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Error al actualizar chofer")
    return res.json()
  },

  async deleteChofer(id: number): Promise<void> {
    const res = await apiFetch(`${API_URL}/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Error al eliminar chofer")
  },

}
