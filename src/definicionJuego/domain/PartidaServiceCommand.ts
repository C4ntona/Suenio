import { Partida } from "./Partida";
import { DTOPartida } from "./dto/DTOPartida";

export interface PartidaServicioCommand {
    insert(objetoPartida: DTOPartida): Promise<Partida>;
    modify(objetoPartida: DTOPartida): Promise<Partida>;
    delete(identificador: string): Promise<Partida>;
}