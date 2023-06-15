import { FindAll } from "./FindAll";
import { Usuario } from "./Usuario";

export interface UsuarioServicioQuery {
    findAll(): Promise<FindAll[]>
    find(identificador: string): Promise<Usuario | undefined>
}