import type { Encomienda, EncomiendaForInput, EncomiendaFormData } from "../types/encomienda"

const API_URL = "http://localhost:5100/api/encomiendas"

//GetAll uso para mostrar localidades con en formulario Destinos (id,nombre)
export const EncomiendaService = {
  async getAllEncomiendas(): Promise<Encomienda[]> {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error("Error al cargar las encomiendas")
    return res.json()
  },

  async addNewEncomienda(data: /* EncomiendaFormData */EncomiendaForInput): Promise<Encomienda> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al crear nueva encomienda")
    }
    const nuevaEncomienda: Encomienda = await res.json()
    return nuevaEncomienda
  },

  async updateEncomienda(id: number, data: EncomiendaFormData): Promise<Encomienda> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Error al actualizar encomienda")
    return res.json()
  },

  async deleteEncomienda(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`,
      { method: "DELETE" })
    if (!res.ok) throw new Error("Error al eliminar encomienda")
  },
}
