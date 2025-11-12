"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { DestinosView } from "../views/destinos-view"
import type { Localidad, LocalidadFormData } from "../../types/encomienda"
import { useLocalidades } from "../../services/hooks-services/use-localidades"

interface ViewDestinosModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  //onDeleteLocalidad?: (id: number) => void
  //onEditLocalidad? : (id:number, data:LocalidadFormData) => void
}

export function ViewDestinosModal({ open, onOpenChange, /* localidades,  onDeleteLocalidad */}: ViewDestinosModalProps) {
  const { localidades, addLocalidad,deleteLocalidad, updateLocalidad, loadingLocalidad,reloadLocalidades } = useLocalidades()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestión de Destinos</DialogTitle>
        </DialogHeader>
        {/* <DestinosView  localidades={localidades} onDeleteLocalidad={onDeleteLocalidad}  /> */}
          {loadingLocalidad ? (
          <p className="text-center py-6">Cargando localidades...</p>
        ) : (
          <DestinosView
            /* localidades={localidades}
            onDeleteLocalidad={deleteLocalidad}
            onEditLocalidad={updateLocalidad} */
            localidades={localidades}
            onEditLocalidad={async (id, data) => {
              await updateLocalidad(id, data) //edita
              await reloadLocalidades() //recarga después de editar
            }}
            onDeleteLocalidad={async (localidad) => {
              await deleteLocalidad(localidad) //Elimino
              await reloadLocalidades() //también podés hacerlo acá si querés refrescar desde el backend
            }}
          />
        )}
      </DialogContent>
      {/* </DialogContent> */}
    </Dialog>
  )
}
