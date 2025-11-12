import {AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    //AlertDialogOverlay,
    //AlertDialogPortal,
    AlertDialogTitle,
    //AlertDialogTrigger
} from "../ui/alert-dialog"
import type { Chofer } from "../../types/encomienda"

interface DeleteChoferModalProps{
 chofer?: Chofer
 open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: number) => void
}

export function DeleteChoferModal({ open, onOpenChange, chofer, onConfirm }: DeleteChoferModalProps) {
  if(!chofer) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar chofer</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Seguro que querés eliminar al chofer <b>{chofer?.nombre}</b>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(chofer.id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
