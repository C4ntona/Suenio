import { Dependency } from "../../commons/dependecy-container/Dependency";
import { FindAll } from "./FindAll";
import { Personaje } from "./Personaje";


export interface PersonajeRepositoryQuery extends Dependency {
    findAll():Promise<FindAll[]>
    find(identificador:string):Promise<Personaje|undefined>;
    insert(Personaje:Personaje):void;
    delete(identificador:string):void
}