import { FindAll } from "../domain/FindAll.js";
import { Tienda } from "../domain/Tienda.js"
import { TiendaRepositoryQuery } from "../domain/TiendaRepositoryQuery.js";

export class RepositoryTiendaQueryFicheros implements TiendaRepositoryQuery{
    private data: Map<string, Tienda>
    public static NAME = "RepositoryOperationQueryFicheros";

    public constructor() {
        this.data = new Map()
    }
  

    getName(): string {
        return RepositoryTiendaQueryFicheros.NAME
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

    public async find(identificador: string): Promise<Tienda | undefined >{
        return await this.data.get(identificador);
    }

    public insert(objetoTienda: Tienda): void {
        this.data.set(objetoTienda.getIdentificador(), objetoTienda)
    }

    public delete(identificador: string): void {
        this.data.delete(identificador);
    }

}