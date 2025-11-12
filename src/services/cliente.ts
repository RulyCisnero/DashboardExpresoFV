import type {  ClienteFormData,  Cliente , ClienteFormInput} from "../types/encomienda"

const API_URL = "http://localhost:5100/api/clientes"

export const ClienteService = {
    async getAllClientes(): Promise<Cliente[]> {
        const res = await fetch(API_URL, { cache: "no-store" })
        if (!res.ok) throw new Error("Error al cargar clientes")
        return res.json()
    },

    async addNewCliente(data: /* ClienteFormData */ClienteFormInput): Promise<Cliente> {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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
        const res = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error("Error al actualizar cliente")
        return res.json()
      },

    async deleteCliente(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, 
        { method: "DELETE" })
    if (!res.ok) throw new Error("Error al eliminar el cliente desde fetch")
  },


}
