import type { Encomienda, Cliente, Chofer, Destino } from "../types/encomienda"

export const initialEncomiendas: Encomienda[] = [
  {
    id: 1,
    codigo: "ENC-001",
    remitente: "Juan Pérez",
    destinatario: "María García",
    telefono: "+54 11 1234-5678",
    email: "juan.perez@email.com",
    origen: "Buenos Aires",
    destino: "Córdoba",
    estado: "En tránsito",
    fechaEnvio: "2024-01-15",
    fechaEntrega: "2024-01-18",
    peso: "2.5 kg",
    precio: "$15,000",
    descripcion: "Documentos importantes",
    chofer: "Carlos Rodríguez",
  },
  {
    id: 2,
    codigo: "ENC-002",
    remitente: "Ana López",
    destinatario: "Pedro Martínez",
    telefono: "+54 11 9876-5432",
    email: "ana.lopez@email.com",
    origen: "Rosario",
    destino: "Mendoza",
    estado: "Pendiente",
    fechaEnvio: "2024-01-16",
    fechaEntrega: "2024-01-19",
    peso: "1.2 kg",
    precio: "$12,000",
    descripcion: "Ropa y accesorios",
    chofer: "Luis González",
  },
  {
    id: 3,
    codigo: "ENC-003",
    remitente: "Roberto Silva",
    destinatario: "Carmen Ruiz",
    telefono: "+54 11 5555-1234",
    email: "roberto.silva@email.com",
    origen: "La Plata",
    destino: "Tucumán",
    estado: "Entregado",
    fechaEnvio: "2024-01-10",
    fechaEntrega: "2024-01-13",
    peso: "3.8 kg",
    precio: "$18,500",
    descripcion: "Productos electrónicos",
    chofer: "Miguel Torres",
  },
]

export const initialClientes: Cliente[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    telefono: "+54 11 1234-5678",
    email: "juan.perez@email.com",
    direccion: "Av. Corrientes 1234, Buenos Aires",
  },
  {
    id: 2,
    nombre: "Ana López",
    telefono: "+54 11 9876-5432",
    email: "ana.lopez@email.com",
    direccion: "San Martín 567, Rosario",
  },
  {
    id: 3,
    nombre: "Roberto Silva",
    telefono: "+54 11 5555-1234",
    email: "roberto.silva@email.com",
    direccion: "Calle 7 890, La Plata",
  },
]

export const initialChoferes: ChoferR[] = [
  {
    id: 1,
    nombre: "Carlos Rodríguez",
    telefono: "+54 11 1111-2222",
    vehiculo: "Ford Transit - ABC123",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Luis González",
    telefono: "+54 11 3333-4444",
    vehiculo: "Mercedes Sprinter - DEF456",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Miguel Torres",
    telefono: "+54 11 5555-6666",
    vehiculo: "Iveco Daily - GHI789",
    estado: "Inactivo",
  },
]

export const initialDestinos: Destino[] = [
  {
    id: 1,
    nombre: "Buenos Aires",
  },
  {
    id: 2,
    nombre: "Córdoba",
  },
  {
    id: 3,
    nombre: "Rosario",
  },
  {
    id: 4,
    nombre: "Mendoza",
  },
  {
    id: 5,
    nombre: "La Plata",
  },
]
