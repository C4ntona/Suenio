import { FindAll } from "../domain/FindAll";
import { Usuario } from "../domain/Usuario";
import { UsuarioQuery } from "../domain/UsuarioRepositoryQuery";

export class RepositoryUsuarioQueryFicheros implements UsuarioQuery {
  public static readonly NAME = "RepositoryUsuarioQueryFicheros";

  private data: Map<string, Usuario>;

  public constructor() {
    this.data = new Map();
  }

  public getName(): string {
    return RepositoryUsuarioQueryFicheros.NAME
  }

  public async findAll(): Promise<FindAll[]>{
    let listaFindAll: FindAll[] = []
    for (const key of this.data.keys()) {
      const value = this.data.get(key);
      if (value != undefined)
        listaFindAll.push(new FindAll(value.getemail(), value.getNombre()));
    }
    return listaFindAll;
  }
  public async find(identificador: string): Promise<Usuario | undefined >{
    return await this.data.get(identificador);
  }

  public insert(objetoUsuario: Usuario): void {
    this.data.set(objetoUsuario.getemail(), objetoUsuario);
  }

  public delete(identificador: string): void {
    this.data.delete(identificador)
  }
}