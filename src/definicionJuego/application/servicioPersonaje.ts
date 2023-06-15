import { Personaje } from "../domain/Personaje.js";
import { PersonajeRepositoryQuery } from "../domain/PersonajeRepositoryQuery.js";
import { PersonajeServicioQuery } from "../domain/PersonajeServiceQuery.js";
import { FindAll } from "../domain/FindAll.js";
import { PersonajeServicioCommand } from "../domain/PersonajeServiceCommand.js";
import { PersonajeRepositoryCommand } from "../domain/PersonajeRepositoryCommand.js";
import { DTOPersonaje } from "../domain/dto/DTOPersonaje.js";
import { BuilderPersonaje } from "../infraestructura/BuilderPersonaje.js";

export class ServicioPersonaje implements PersonajeServicioQuery, PersonajeServicioCommand {

    private static instance: ServicioPersonaje;
    private repoPEquery :PersonajeRepositoryQuery; 
    private repoPEcommand :PersonajeRepositoryCommand; 

    private constructor(repoPEquery :PersonajeRepositoryQuery, repoPEcommand :PersonajeRepositoryCommand) {
        this.repoPEquery = repoPEquery;
        this.repoPEcommand = repoPEcommand;
    }
    public static getInstance():ServicioPersonaje {
        if(ServicioPersonaje.instance == undefined){
            throw new Error("No se ha inicializado el repositorio en arranque");
        }
        return ServicioPersonaje.instance;
    }

    /**
     * Método para inicializar el repositorio durante la inicialización de la aplicación
     * Si se realiza en otro punto arrojará una excepción
     * 
     * @param repo Instancia del repositorio a utilizar
     */
    public static initialize(repoPEquery :PersonajeRepositoryQuery, repoPEcommand :PersonajeRepositoryCommand): ServicioPersonaje{
        if(ServicioPersonaje.instance != undefined){
            throw new Error("Se ha intentado inicializar el repositorio fuera del arranque");
        }
        ServicioPersonaje.instance = new ServicioPersonaje(repoPEquery, repoPEcommand);
        return ServicioPersonaje.instance;
    }

    public async findAll(): Promise<FindAll[]> {
        return this.repoPEquery.findAll();
    }
    
    public async find(identificador: string): Promise<Personaje | undefined>{
        return this.repoPEquery.find(identificador);
    }

    public async insert(datos: DTOPersonaje): Promise<Personaje> {
        let objetoPersonaje :Personaje= BuilderPersonaje.build(datos)
        return this.repoPEcommand.insert(objetoPersonaje);
    }
    
    public async modify(datos: DTOPersonaje,): Promise<Personaje> {
        let objetoPersonaje :Personaje= BuilderPersonaje.build(datos)
        return this.repoPEcommand.modify(objetoPersonaje);
    }
    
    public async delete(identificador: string): Promise<Personaje>{
        return this.repoPEcommand.delete(identificador);
    }

}