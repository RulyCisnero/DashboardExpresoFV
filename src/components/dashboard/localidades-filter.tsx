import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import type { EncomiendaRich, Localidad } from "../../types/encomienda";

interface FilterlocalidadesProps {
    localidades: Localidad[]
    selectedLocalidad: Localidad | "Todas"
    onLocalidadChange: (value: Localidad | "Todas") => void;
}
export function Filterlocalidades({ localidades, selectedLocalidad, onLocalidadChange }: FilterlocalidadesProps) {
    return (
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            {/* Filtro de localidades */}
            < div className="flex items-center gap-4" >
                <div className="flex items-center gap-2">
                    <Label htmlFor="localidad" className="text-sm font-medium">
                        Filtrar por localidad:
                    </Label>
                    <Select
                        value={selectedLocalidad === "Todas" ? "Todas" : selectedLocalidad.nombre}
                        onValueChange={(nombre) => {
                            const loc = localidades.find((l) => l.nombre === nombre)
                            onLocalidadChange(loc ?? "Todas")
                        }}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Seleccionar localidad" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="Todas">Todas</SelectItem>
                            {localidades.map((loc) => (
                                <SelectItem key={loc.id} value={loc.nombre}>
                                    {loc.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div >
        </div >
    )
}