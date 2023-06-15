import { Usuario } from "./Usuario";
import { DTOUsuario } from "./dto/DTOUsuario";

export interface UsuarioServicioCommand {
    insert(objetoTipoTest: DTOUsuario):Promise<Usuario>;
    modify(objetoTipoTest: DTOUsuario):Promise<Usuario>;
    delete(identificador: string): Promise<Usuario>;
}