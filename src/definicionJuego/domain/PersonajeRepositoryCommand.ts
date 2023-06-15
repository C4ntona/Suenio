import { Dependency } from "../../commons/dependecy-container/Dependency";
import { Personaje } from "./Personaje";

export interface PersonajeRepositoryCommand extends Dependency {
    insert(objetoPersonaje: Personaje):Promise<Personaje>;
    modify(objetoPersonaje: Personaje):Promise<Personaje>;
    delete(identificador: string): Promise<Personaje>;
}