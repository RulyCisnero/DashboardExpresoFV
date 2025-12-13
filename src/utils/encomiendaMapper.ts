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

  const cliente = clientes.find(c => c.id === e.cliente_id)!
  //const destinatario = clientes.find(c => c.id === e.cliente_destinatario_id)!
const destinatario =
  e.cliente_destinatario_id !== null && e.cliente_destinatario_id !== undefined
    ? clientes.find(c => c.id === e.cliente_destinatario_id) || null
    : null;     
  const origen = localidades.find(l => l.id === e.origen_id)!
  const destino = localidades.find(l => l.id === e.destino_id)!
  const chofer = choferes.find(ch => ch.id === e.chofer_id)!

  return {
    id: e.id,
    tipo: e.tipo,
    direccion_destino: e.direccion_destino,
    estado: e.estado,
    fecha_creacion: e.fecha_creacion,
    precio: Number(e.precio),
    descripcion: e.descripcion,
    cliente,
    destinatario,
    origen,
    destino,
    chofer
  }
}
