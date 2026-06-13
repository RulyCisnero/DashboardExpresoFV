import type {
  Encomienda,
  EncomiendaInput,
  EncomiendaUpdate,
  EncomiendaRich
} from "../types/encomienda"
import { apiFetch } from "./apiClient.ts"

const API_URL = "http://localhost:5100/api/encomiendas"

export const EncomiendaService = {

  /** 🔹 Obtener TODAS las encomiendas (crudas) */
  async getAll(): Promise<EncomiendaRich[]> {
    const res = await apiFetch(API_URL)
    if (!res.ok) throw new Error("Error al cargar las encomiendas")
    return res.json()
  },

  /** 🔹 Crear una nueva encomienda */
  async create(data: EncomiendaInput): Promise<Encomienda> {
    const res = await apiFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al crear la encomienda")
    }

    return res.json()
  },

  /** 🔹 Actualizar una encomienda */
  async update(id: number, data: EncomiendaUpdate): Promise<Encomienda> {
    const res = await apiFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error("Error al actualizar la encomienda")
    return res.json()
  },

  /** 🔹 Obtener encomienda por ID (enriquecida) */
  async getById(id: number): Promise<EncomiendaRich> {
    const res = await apiFetch(`${API_URL}/${id}`)
    if (!res.ok) throw new Error("Error al obtener la encomienda")
    return res.json()
  },

  async getByCliente(clienteId: number): Promise<EncomiendaRich[]> {
    const res = await apiFetch(`${API_URL}/cliente/${clienteId}`)
    if (!res.ok) throw new Error("Error al cargar encomiendas del cliente")
    return res.json()
  },

  async getByDate(fecha: string): Promise<EncomiendaRich[]> {
    const res = await apiFetch(`${API_URL}/fecha?fecha=${fecha}`);
    if (!res.ok) throw new Error("Error al filtrar encomiendas por fecha");
    return res.json();
  },

  /** 🔹 Eliminar */
  async delete(id: number): Promise<void> {
    const res = await apiFetch(`${API_URL}/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Error al eliminar la encomienda")
  },
}
