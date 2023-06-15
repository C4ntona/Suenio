import { FindAll } from "./FindAll";
import { Partida } from "./Partida";

export interface PartidaServicioQuery {
    findAll():Promise<FindAll[]>
    find(identificador:string):Promise<Partida|undefined>
}