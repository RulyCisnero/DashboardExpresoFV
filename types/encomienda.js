/**
 * @typedef {Object} Encomienda
 * @property {number} id - ID único de la encomienda
 * @property {string} codigo - Código de la encomienda (ej: ENC-001)
 * @property {string} remitente - Nombre del remitente
 * @property {string} destinatario - Nombre del destinatario
 * @property {string} origen - Ciudad de origen
 * @property {string} destino - Ciudad de destino
 * @property {EstadoEncomienda} estado - Estado actual de la encomienda
 * @property {string} fechaEnvio - Fecha de envío (formato YYYY-MM-DD)
 * @property {string} fechaEntrega - Fecha de entrega estimada (formato YYYY-MM-DD)
 * @property {string} peso - Peso del paquete (ej: "2.5 kg")
 * @property {string} precio - Precio del envío (ej: "$15.000")
 * @property {string} telefono - Teléfono del remitente
 * @property {string} email - Email del remitente
 * @property {string} descripcion - Descripción del contenido
 * @property {string} chofer - Nombre del chofer asignado
 */

/**
 * @typedef {Object} Cliente
 * @property {number} id - ID único del cliente
 * @property {string} nombre - Nombre completo del cliente
 * @property {string} telefono - Teléfono del cliente
 * @property {string} email - Email del cliente
 * @property {string} direccion - Dirección del cliente
 */

/**
 * @typedef {"Pendiente" | "En tránsito" | "Entregado" | "Cancelado"} EstadoEncomienda
 */

/**
 * @typedef {Object} EncomiendaFormData
 * @property {string} remitente
 * @property {string} destinatario
 * @property {string} origen
 * @property {string} destino
 * @property {EstadoEncomienda} estado
 * @property {string} fechaEnvio
 * @property {string} fechaEntrega
 * @property {string} peso
 * @property {string} precio
 * @property {string} telefono
 * @property {string} email
 * @property {string} descripcion
 * @property {string} chofer
 */

/**
 * @typedef {Object} ClienteFormData
 * @property {string} nombre
 * @property {string} telefono
 * @property {string} email
 * @property {string} direccion
 */

/**
 * @typedef {Object} Chofer
 * @property {number} id - ID único del chofer
 * @property {string} nombre - Nombre completo del chofer
 * @property {string} telefono - Teléfono del chofer
 * @property {string} email - Email del chofer
 * @property {string} licencia - Número de licencia de conducir
 * @property {string} vehiculo - Información del vehículo
 * @property {string} estado - Estado del chofer (Activo/Inactivo)
 */

/**
 * @typedef {Object} Destino
 * @property {number} id - ID único del destino
 * @property {string} nombre - Nombre del destino/ciudad
 * @property {string} provincia - Provincia o estado
 * @property {string} codigoPostal - Código postal
 * @property {string} direccion - Dirección específica
 * @property {boolean} activo - Si el destino está activo
 */

/**
 * @typedef {Object} ChoferFormData
 * @property {string} nombre
 * @property {string} telefono
 * @property {string} email
 * @property {string} licencia
 * @property {string} vehiculo
 * @property {string} estado
 */

/**
 * @typedef {Object} DestinoFormData
 * @property {string} nombre
 * @property {string} provincia
 * @property {string} codigoPostal
 * @property {string} direccion
 * @property {boolean} activo
 */

// Localidades específicas del sistema
export const LOCALIDADES = ["Todas", "Bahía Blanca", "Coronel Dorrego", "Monte Hermoso", "Tres Arroyos"]

// Exportamos las definiciones para JSDoc (esto es solo documentación)
export const EncomiendaTypes = {
  // Este objeto está vacío, solo sirve para que JSDoc reconozca las definiciones
}
