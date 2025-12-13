export type EstadoEncomienda = "Pendiente" | "En tránsito" | "Entregada" | "Cancelado"
export type TipoEncomienda = "ENTRANTE" | "SALIENTE"

export interface Encomienda {
  id: number
  tipo: TipoEncomienda //o string?
  direccion_destino: string;
  estado: EstadoEncomienda; //o string?
  fecha_creacion: string//Date
  precio: number;
  descripcion?: string;
  cliente_id: number;
  chofer_id: number;
  origen_id: number;
  destino_id: number;
  cliente_destinatario_id: number;
}
export type EncomiendaInput = Omit<Encomienda, "id">

export type EncomiendaUpdate = Omit<Encomienda, "id">

export interface EncomiendaRich extends Omit<Encomienda,
  "cliente_id" | "cliente_destinatario_id" | "origen_id" | "destino_id" | "chofer_id"> {
  cliente: Cliente //ClienteFormData
  destinatario: Cliente | null //ClienteFormData
  origen: Localidad //LocalidadFormData
  destino: Localidad //LocalidadFormData
  chofer: Chofer //ChoferFormData
}

export interface EncomiendaForInput {
  tipo: TipoEncomienda
  estado: EstadoEncomienda
  direccion_destino: string
  fecha_creacion: string//Date
  descripcion?: string
  precio: number
  origen_id: number
  destino_id: number
  cliente_id: number
  cliente_destinatario_id: number
  chofer_id: number
}

export interface Cliente {
  id: number
  nombre: string
  apellido: string
  direccion_local: string
  telefono: string
  email: string
  localidad: Localidad //foranea a localidad (id)
}

export interface ClienteFormInput {
  nombre: string;
  apellido: string;
  direccion_local: string;
  telefono: string;
  email: string;
  id_localidad: number;
}

export interface ClienteFormData {
  id: number;
  nombre: string;
  apellido: string;
  direccion_local: string;
  telefono: string;
  email: string;
  localidad: Localidad;
}

export interface Chofer {
  id: number
  nombre: string
  apellido: string
  telefono: string
  email: string
}

export interface ChoferFormData {
  nombre: string
  apellido: string
  telefono: string
  email: string
}

export interface Localidad {
  id: number
  nombre: string
}
//interface de formulario (cuando se da de alta una localidad solamente se le pide el nombre)  
//el id se genera automaticamente
export interface LocalidadFormData {
  nombre: string
}

