import { Tienda } from "./Tienda";
import { DTOTienda } from "./dto/DTOTienda";

export interface TiendaServicioCommand {
    insert(objetoTienda: DTOTienda): Promise<Tienda>;
    modify(objetoTienda: DTOTienda): Promise<Tienda>;
    delete(identificador: string): Promise<Tienda>;
}