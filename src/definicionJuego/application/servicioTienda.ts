import { Tienda } from "../domain/Tienda.js";
import { FindAll } from "../domain/FindAll.js";
import { TiendaRepositoryQuery } from "../domain/TiendaRepositoryQuery.js";
import { TiendaServicioQuery } from "../domain/TiendaServiceQuery.js"
import { TiendaServicioCommand } from "../domain/TiendaServiceCommand.js";
import { TiendaRepositoryCommand } from "../domain/TiendaRepositoryCommand.js";
import { DTOTienda } from "../domain/dto/DTOTienda.js";
import { BuilderTienda } from "../infraestructura/BuilderTienda.js";

export class ServicioTienda implements TiendaServicioQuery, TiendaServicioCommand {

    private static instance: ServicioTienda;
    private repoTIquery :TiendaRepositoryQuery; 
    private repoTIcommand :TiendaRepositoryCommand; 
    
    private constructor(repoTIquery :TiendaRepositoryQuery, repoTIcommand :TiendaRepositoryCommand) {
        this.repoTIquery = repoTIquery;
        this.repoTIcommand = repoTIcommand;
    }

    public static getInstance():ServicioTienda{
        if(ServicioTienda.instance == undefined){
            throw new Error("No se ha inicializado el repositorio en arranque");
        }
        return ServicioTienda.instance;
    } 

    /**
     * Método para inicializar el repositorio durante la inicialización de la aplicación
     * Si se realiza en otro punto arrojará una excepción
     * 
     * @param repo Instancia del repositorio a utilizar
     */
    public static initialize( repoTIquery :TiendaRepositoryQuery, repoTIcommand :TiendaRepositoryCommand):ServicioTienda{
        if(ServicioTienda.instance != undefined){
            throw new Error("Se ha intentado inicializar el repositorio fuera del arranque");
        }
        ServicioTienda.instance = new ServicioTienda(repoTIquery, repoTIcommand);
        return ServicioTienda.instance;
    }

    public async findAll(): Promise<FindAll[]>{
        return await this.repoTIquery.findAll();
    }

    public async find(identificador: string):Promise<Tienda | undefined>{
        return await this.repoTIquery.find(identificador)
    }

    public async insert(objetoDTO: DTOTienda) : Promise<Tienda>{
        let objetoOperaApi = await BuilderTienda.build(objetoDTO);
        return await this.repoTIcommand.insert(objetoOperaApi);
    }
    
    public async modify(objetoDTO: DTOTienda) : Promise<Tienda>{
        let objetoOperaApi = await BuilderTienda.build(objetoDTO)
        return  this.repoTIcommand.modify(objetoOperaApi);
    }

    public delete(identificador: string): Promise<Tienda>{
        return this.repoTIcommand.delete(identificador);
    }

}