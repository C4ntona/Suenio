import { Dependency } from "../../commons/dependecy-container/Dependency";
import { FindAll } from "./FindAll";
import { Tienda } from "./Tienda";


export interface TiendaRepositoryQuery extends Dependency {
    findAll():Promise<FindAll[]>
    find(identificador:string):Promise<Tienda|undefined>;
    insert(Tienda:Tienda):void;
    delete(identificador:string):void
}