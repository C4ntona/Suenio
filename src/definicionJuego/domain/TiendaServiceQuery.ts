import { FindAll } from "./FindAll";
import { Tienda } from "./Tienda";

export interface TiendaServicioQuery {
    findAll():Promise<FindAll[]>
    find(identificador:string):Promise<Tienda|undefined>
}