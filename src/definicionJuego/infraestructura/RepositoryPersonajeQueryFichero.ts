import { FindAll } from "../domain/FindAll.js";
import { Personaje } from "../domain/Personaje.js"
import { PersonajeRepositoryQuery } from "../domain/PersonajeRepositoryQuery.js";

export class RepositoryPersonajeQueryFicheros implements PersonajeRepositoryQuery{
    private data: Map<string, Personaje>
    public static NAME = "RepositoryOperationQueryFicheros";

    public constructor() {
        this.data = new Map()
    }
  

    getName(): string {
        return RepositoryPersonajeQueryFicheros.NAME
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

    public async find(identificador: string): Promise<Personaje | undefined >{
        return await this.data.get(identificador);
    }

    public insert(objetoPersonaje: Personaje): void {
        this.data.set(objetoPersonaje.getIdentificador(), objetoPersonaje)
    }

    public delete(identificador: string): void {
        this.data.delete(identificador);
    }

}