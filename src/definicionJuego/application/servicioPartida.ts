import { Partida } from "../domain/Partida.js";
import { FindAll } from "../domain/FindAll.js";
import { PartidaRepositoryQuery } from "../domain/PartidaRepositoryQuery.js";
import { PartidaServicioQuery } from "../domain/PartidaServiceQuery.js"
import { PartidaServicioCommand } from "../domain/PartidaServiceCommand.js";
import { PartidaRepositoryCommand } from "../domain/PartidaRepositoryCommand.js";
import { DTOPartida } from "../domain/dto/DTOPartida.js";
import { BuilderPartida } from "../infraestructura/BuilderPartida.js";

export class ServicioPartida implements PartidaServicioQuery, PartidaServicioCommand {

    private static instance: ServicioPartida;
    private repoPARquery :PartidaRepositoryQuery; 
    private repoPARcommand :PartidaRepositoryCommand; 
    
    private constructor(repoPARquery :PartidaRepositoryQuery, repoPARcommand :PartidaRepositoryCommand) {
        this.repoPARquery = repoPARquery;
        this.repoPARcommand = repoPARcommand;
    }

    public static getInstance():ServicioPartida{
        if(ServicioPartida.instance == undefined){
            throw new Error("No se ha inicializado el repositorio en arranque");
        }
        return ServicioPartida.instance;
    } 

    /**
     * Método para inicializar el repositorio durante la inicialización de la aplicación
     * Si se realiza en otro punto arrojará una excepción
     * 
     * @param repo Instancia del repositorio a utilizar
     */
    public static initialize( repoPARquery :PartidaRepositoryQuery, repoPARcommand :PartidaRepositoryCommand):ServicioPartida{
        if(ServicioPartida.instance != undefined){
            throw new Error("Se ha intentado inicializar el repositorio fuera del arranque");
        }
        ServicioPartida.instance = new ServicioPartida(repoPARquery, repoPARcommand);
        return ServicioPartida.instance;
    }

    public async findAll(): Promise<FindAll[]>{
        return await this.repoPARquery.findAll();
    }

    public async find(identificador: string):Promise<Partida | undefined>{
        return await this.repoPARquery.find(identificador)
    }

    public async insert(objetoDTO: DTOPartida) : Promise<Partida>{
        let objetoOperaApi = await BuilderPartida.buildAnonymous(objetoDTO);
        return await this.repoPARcommand.insert(objetoOperaApi);
    }
    
    public async modify(objetoDTO: DTOPartida) : Promise<Partida>{
        let objetoOperaApi = await BuilderPartida.build(objetoDTO)
        return  this.repoPARcommand.modify(objetoOperaApi);
    }

    public delete(identificador: string): Promise<Partida>{
        return this.repoPARcommand.delete(identificador);
    }

}