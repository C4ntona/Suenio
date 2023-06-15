import { FindAll } from "./FindAll";
import { Personaje } from "./Personaje";


export interface PersonajeServicioQuery {
    findAll():Promise<FindAll[]>
    find(identificador:string):Promise<Personaje|undefined>
}