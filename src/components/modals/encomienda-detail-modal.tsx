import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { getEstadoBadgeVariant } from "../../lib/utils-encomienda"
import { Package, User, MapPin, Calendar, DollarSign, Phone } from "lucide-react"
import type { EncomiendaRich } from "../../types/encomienda"

interface EncomiendaDetailModalProps {
  encomienda: EncomiendaRich | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EncomiendaDetailModal({encomienda, open, onOpenChange }: EncomiendaDetailModalProps) {

  if (!encomienda) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalles de Encomienda -- ENC {encomienda?.id} - {encomienda.tipo}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información del Remitente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Nombre:</strong> {encomienda?.cliente.nombre} {encomienda?.cliente.apellido}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {encomienda?.cliente.telefono}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {encomienda?.cliente.direccion_local} - {encomienda.cliente.localidad.nombre}
                </p>
              </CardContent>
            </Card>
              
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información del Destinatario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Nombre:</strong> {encomienda?.destinatario.nombre} {encomienda?.destinatario.apellido}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {encomienda?.destinatario.direccion_local}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {encomienda?.destinatario.telefono}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4" />
                Detalles del Envío
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-4">
                {/* <div>
                  <p className="text-sm text-gray-600">Origen</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {encomienda?.origen.nombre}
                  </p>
                </div> */}
                <div>
                  <p className="text-sm text-gray-600">Direccion Destino</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {encomienda.direccion_destino} - {encomienda?.destino.nombre}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  {/*  <Badge
                    variant={getEstadoBadgeVariant(encomienda.estado)}
                    className={`mt-1 ${encomienda.estado === "Entregado" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}`}
                  >
                    {encomienda.estado}
                  </Badge>   */}
                  <Badge
                    variant={getEstadoBadgeVariant(encomienda.estado) as any}
                    className={
                      encomienda.estado === "Entregada" ? "bg-green-100 text-green-800 hover:bg-green-300" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-300"
                    } 
                  >
                    {encomienda.estado}
                  </Badge>

                </div>
                {/* <div>
                  <p className="text-sm text-gray-600">Peso</p>
                  <p className="font-medium">{encomienda?.peso}</p>
                </div> */}
                <div>
                  <p className="text-sm text-gray-600">Precio</p>
                  <p className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {encomienda?.precio}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Fecha de Envío</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(encomienda.fecha_creacion).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de Entrega</p>
                  {/* <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {encomiendaV?.fechaEntrega}
                  </p> */}
                </div>
              </div>

              {encomienda.descripcion && (
                <div>
                  <p className="text-sm text-gray-600">Descripción</p>
                  <p className="font-medium bg-gray-50 p-3 rounded-md mt-1">{encomienda?.descripcion}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
