import { Usuario } from "./Usuario";
import { Dependency } from "../../commons/dependecy-container/Dependency";
import { IdUsuario } from "./IdUsuario";

export interface UsuarioCommand extends Dependency {
    insert(Usuario: Usuario): Promise<Usuario>;
    modify(Usuario: Usuario): Promise<Usuario>;
    delete(identificador: string): Promise<Usuario>;
    modifyId(IdUsuario: IdUsuario):Promise<Usuario>;
}