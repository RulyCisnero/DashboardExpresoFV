import type { ClienteFormData, Cliente, ClienteFormInput } from "../types/encomienda"
import { apiFetch } from "./apiClient.ts"

const API_URL = "http://localhost:5100/api/clientes"

export const ClienteService = {
  async getAllClientes(): Promise<Cliente[]> {
    const res = await apiFetch(API_URL, { cache: "no-store" })
    if (!res.ok) throw new Error("Error al cargar clientes")
    return res.json()
  },

  async addNewCliente(data: ClienteFormInput): Promise<Cliente> {
    const res = await apiFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al crear el cliente")
    }
    const nuevoCliente: Cliente = await res.json()
    return nuevoCliente
  },

  async updateCliente(id: number, data: ClienteFormInput): Promise<Cliente> {
    const res = await apiFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Error al actualizar cliente")
    return res.json()
  },

  async searchCliente(id: number): Promise<Cliente> {
    const res = await apiFetch(`${API_URL}/clientes/${id}`);
    if (!res.ok) {
      throw new Error("Error al cargar cliente");
    }
    return await res.json();
  },

  async searchClienteTexto(query: string): Promise<Cliente[]> {
    const res = await apiFetch(`${API_URL}/buscar?q=${encodeURIComponent(query)}`);
    if (res.status === 404) {
      return []; // sin resultados (NO es error)
    }
    if (!res.ok) {
      throw new Error("Error al buscar cliente");
    }
    return await res.json();
  },

  async deleteCliente(id: number): Promise<void> {
    const res = await apiFetch(`${API_URL}/${id}`,
      { method: "DELETE" })
    if (!res.ok) throw new Error("Error al eliminar el cliente desde fetch")
  },

}
