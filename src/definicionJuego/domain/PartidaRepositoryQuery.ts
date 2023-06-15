import { Dependency } from "../../commons/dependecy-container/Dependency";
import { FindAll } from "./FindAll";
import { Partida } from "./Partida";


export interface PartidaRepositoryQuery extends Dependency {
    findAll():Promise<FindAll[]>
    find(identificador:string):Promise<Partida|undefined>;
    insert(Partida:Partida):void;
    delete(identificador:string):void
}