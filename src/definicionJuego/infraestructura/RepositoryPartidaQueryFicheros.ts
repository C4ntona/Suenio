import { FindAll } from "../domain/FindAll.js";
import { Partida } from "../domain/Partida.js"
import { PartidaRepositoryQuery } from "../domain/PartidaRepositoryQuery.js";

export class RepositoryPartidaQueryFicheros implements PartidaRepositoryQuery{
    private data: Map<string, Partida>
    public static NAME = "RepositoryOperationQueryFicheros";

    public constructor() {
        this.data = new Map()
    }
  

    getName(): string {
        return RepositoryPartidaQueryFicheros.NAME
    }


    public async findAll(): Promise<FindAll[]> {
        let listaFindAll: FindAll[]=[]
        for (const key of this.data.keys()) {
          const value = this.data.get(key)
          if (value != undefined)
            listaFindAll.push(new FindAll(value.getIdentificador(),value.getNombre()))
        }
        return listaFindAll;
    }

    public async find(identificador: string): Promise<Partida | undefined >{
        return await this.data.get(identificador);
    }

    public insert(objetoPartida: Partida): void {
        this.data.set(objetoPartida.getIdentificador(), objetoPartida)
    }

    public delete(identificador: string): void {
        this.data.delete(identificador);
    }

}