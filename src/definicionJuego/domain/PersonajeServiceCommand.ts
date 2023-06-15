import { Personaje } from "./Personaje";
import { DTOPersonaje } from "./dto/DTOPersonaje";

export interface PersonajeServicioCommand {
    insert(objetoPersonaje: DTOPersonaje):Promise<Personaje>;
    modify(objetoPersonaje: DTOPersonaje):Promise<Personaje>;
    delete(identificador: string): Promise<Personaje>;
}