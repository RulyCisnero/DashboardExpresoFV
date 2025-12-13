import { useCliente } from "./use-cliente";
import { useChoferes } from "./use-choferes";
import { useLocalidades } from "./use-localidades";
import type { Cliente,Chofer,Localidad } from "../../types/encomienda";
import { EncomiendaService } from "../encomienda";
import { mapToEncomiendaRich } from "../../utils/encomiendaMapper";
import type { EncomiendaRich } from "../../types/encomienda";

/* export const useEncomiendaByDate = () => {
  const { clientes } = useCliente();
  const { choferes } = useChoferes();
  const { localidades } = useLocalidades();

  const getByDate = async (fecha: string): Promise<EncomiendaRich[]> => {
    try {
      const raw = await EncomiendaService.getByDate(fecha);

      const mapped = raw.map((e: any) =>
        mapToEncomiendaRich(e, clientes, choferes, localidades)
      );

      return mapped;
    } catch (error) {
      console.error("Error filtrando por fecha:", error);
      return [];
    }
  };
 */
export const useEncomiendaByDate = (
  clientes: Cliente[],
  choferes: Chofer[],
  localidades: Localidad[]
) => {

  const getByDate = async (fecha: string): Promise<EncomiendaRich[]> => {
    try {
      const raw = await EncomiendaService.getByDate(fecha)

      return raw.map((e: any) =>
        mapToEncomiendaRich(e, clientes, choferes, localidades)
      )

    } catch (error) {
      console.error("Error filtrando por fecha:", error)
      return []
    }
  }

  return { getByDate }
}
  //return { getByDate };
//};
