import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { User, MapPin, Calendar, DollarSign, Phone } from "lucide-react"
import { getEstadoBadgeVariant } from "../../lib/utils-encomienda"
import type { EncomiendaRich } from "../../types/encomienda"

interface ChoferEncomiendaStatusModalProps {
  encomienda: EncomiendaRich
  onMarcarEntregada?: (id: number) => void
}

export function ChoferEncomiendaStatusModal({ encomienda, onMarcarEntregada }: ChoferEncomiendaStatusModalProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información de la encomienda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white">Remitente</p>
              <p className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {encomienda.cliente.nombre} {encomienda.cliente.apellido}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {encomienda.cliente.telefono}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {encomienda.cliente.direccion_local} - {encomienda.cliente.localidad.nombre}
              </p>
            </div>

            <div>
              <p className="text-sm text-white">Destinatario</p>
              <p className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {encomienda.destinatario ? `${encomienda.destinatario.nombre} ${encomienda.destinatario.apellido}` : "Sin destinatario"}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {encomienda.destinatario?.telefono || "—"}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {encomienda.destinatario?.direccion_local || "—"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white">Origen</p>
              <p className="font-medium">{encomienda.origen.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-white">Destino</p>
              <p className="font-medium">{encomienda.destino.nombre}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-white">Precio</p>
              <p className="font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                ${encomienda.precio}
              </p>
            </div>
            <div>
              <p className="text-sm text-white">Fecha de envío</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(encomienda.fecha_creacion).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-white">Estado</p>
              <Badge
                variant={getEstadoBadgeVariant(encomienda.estado) as any}
                className={
                  encomienda.estado === "Entregada"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {encomienda.estado}
              </Badge>
            </div>
          </div>

          {encomienda.descripcion && (
            <div>
              <p className="text-sm text-white-600">Descripción</p>
              <p className="font-medium bg-gray-600 text-white p-3 rounded-md mt-1">{encomienda.descripcion}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cambio de estado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-white">Estado actual</p>
            <Badge
              variant={getEstadoBadgeVariant(encomienda.estado) as any}
              className={
                encomienda.estado === "Entregada"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {encomienda.estado}
            </Badge>
          </div>

          {encomienda.estado !== "Entregada" ? (
            <Button type="button" variant="outline" onClick={() => onMarcarEntregada?.(encomienda.id)}>
              Marcar como entregada
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">La encomienda ya fue entregada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
