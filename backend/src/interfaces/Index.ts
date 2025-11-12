type Estado = "Pendiente" | "Entregada";
type Tipo = "Entrante" | "Saliente";

export interface Localidad {
    id: number;
    nombre: string;
}

export interface IChofer {
    id:number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
}

export interface IChoferVista {
    id: number
    nombre: string
    apellido: string
    telefono: string
    email: string
}
//localidad:  Localidad ;

export interface ICliente {
  id: number;
  nombre: string;
  apellido: string;
  direccion_local: string;
  telefono: string;
  email: string;
  id_localidad: number; // clave foránea
}

export interface IClienteVista {
    id: number;
    nombre: string;
    apellido: string;
    direccion_local: string;
    telefono: string;
    email: string;
    localidad: Localidad;
}

export interface IEncomienda {
    id?: number;
    tipo: Tipo;
    estado: Estado;
    direccion_destino: string;
    fecha_creacion: Date;
    descripcion: string;
    precio?: number;
    cliente_id: number;  // Solo ID
    cliente_destinatario_id: number
    chofer_id: number;   // Solo ID
    origen_id: number;   // Solo ID
    destino_id: number;  // Solo ID
}

export interface IEncomiendaVista {
    id: number;
    tipo: Tipo;
    estado: Estado;
    direccion_destino: string;
    fecha_creacion: Date; 
    descripcion: string;
    precio: number; // Ahora es número
    origen: Localidad;
    destino: Localidad;
    cliente: IClienteVista;
    destinatario:IClienteVista;
    chofer: IChoferVista | null; // Puede ser null
}