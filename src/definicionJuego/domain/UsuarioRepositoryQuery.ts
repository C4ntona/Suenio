import { Dependency } from "../../commons/dependecy-container/Dependency";
import { FindAll } from "./FindAll";
import { Usuario } from "./Usuario";

export interface UsuarioQuery extends Dependency{
    findAll(): Promise<FindAll[]>
    find(identificador: string): Promise<Usuario|undefined>;
    insert(objetoUsuario:Usuario):void;
    delete(identificador:string):void;
}