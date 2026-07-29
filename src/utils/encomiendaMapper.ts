/* import type { Cliente, Chofer, Localidad, EncomiendaRich } from "../types/encomienda";

export function mapToEncomiendaRich(
  raw: any,
  clientes: Cliente[],
  choferes: Chofer[],
  localidades: Localidad[]
): EncomiendaRich {
  return {
    ...raw,
    cliente: clientes.find(c => c.id === raw.cliente_id)!,
    cliente_destinatario: clientes.find(c => c.id === raw.cliente_destinatario_id)!,
    origen: localidades.find(l => l.id === raw.origen_id)!,
    destino: localidades.find(l => l.id === raw.destino_id)!,
    chofer: choferes.find(ch => ch.id === raw.chofer_id)!,
  };
}
 */
import type { Cliente } from "../types/encomienda"
import type { Chofer } from "../types/encomienda"
import type { Localidad } from "../types/encomienda"
import type { EncomiendaRich } from "../types/encomienda"

export const mapToEncomiendaRich = (
  e: any,
  clientes: Cliente[],
  choferes: Chofer[],
  localidades: Localidad[]
): EncomiendaRich => {
  const cliente = clientes.find(c => c.id === e.cliente_id) ?? {
    id: e.cliente_id,
    nombre: "Sin cliente",
    apellido: "",
    direccion_local: "",
    telefono: "",
    email: "",
    localidad: { id: 0, nombre: "Sin localidad" }
  }

  const destinatario =
    e.cliente_destinatario_id !== null && e.cliente_destinatario_id !== undefined
      ? clientes.find(c => c.id === e.cliente_destinatario_id) ?? null
      : null

  const origen = localidades.find(l => l.id === e.origen_id) ?? { id: e.origen_id, nombre: "Sin origen" }
  const destino = localidades.find(l => l.id === e.destino_id) ?? { id: e.destino_id, nombre: "Sin destino" }
  const chofer = choferes.find(ch => ch.id === e.chofer_id) ?? {
    id: e.chofer_id,
    nombre: "Sin chofer",
    apellido: "",
    telefono: "",
    email: ""
  }

  return {
    id: e.id,
    tipo: e.tipo,
    direccion_destino: e.direccion_destino,
    estado: e.estado,
    fecha_creacion: e.fecha_creacion,
    fecha_entrega: e.fecha_entrega,
    precio: Number(e.precio),
    descripcion: e.descripcion,
    cliente_id: e.cliente_id,
    chofer_id: e.chofer_id,
    origen_id: e.origen_id,
    destino_id: e.destino_id,
    cliente_destinatario_id: e.cliente_destinatario_id,
    cliente,
    destinatario,
    origen,
    destino,
    chofer
  }
}

