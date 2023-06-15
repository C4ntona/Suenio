import { Dependency } from "../../commons/dependecy-container/Dependency";
import { Partida } from "./Partida";

export interface PartidaRepositoryCommand extends Dependency {
    insert(objetoPartida: Partida):Promise<Partida>;
    modify(objetoPartida: Partida):Promise<Partida>;
    delete(identificador: string): Promise<Partida>;
}