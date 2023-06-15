import { Dependency } from "../../commons/dependecy-container/Dependency";
import { Tienda } from "./Tienda";

export interface TiendaRepositoryCommand extends Dependency {
    insert(objetoTienda: Tienda):Promise<Tienda>;
    modify(objetoTienda: Tienda):Promise<Tienda>;
    delete(identificador: string): Promise<Tienda>;
}