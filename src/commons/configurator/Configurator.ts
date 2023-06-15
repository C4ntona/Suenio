import { Configuration } from "./configuration/Configuration";
import { DependencyDictionary } from "../dependecy-container/dependecy-dictionary/DependencyDictionary";
import { DependencyContainer } from "../dependecy-container/DependencyContainer";
import { ServicioLog } from "../report/ServicioLog";
import { ErrorCircuitBreaker } from "../ErrorCircuitBreaker";
import dotenv from 'dotenv';
dotenv.config()

export class Configurator{
    public static async cargarConfiguracion(): Promise<Configuration> {
        let rawConfig = this.cargarArgsEnv()
        let configuration = this.buildConfiguration(rawConfig)
        this.buildLogDependecy(rawConfig)
        ServicioLog.getInstance().info("Cargando configuracion...")
        ServicioLog.getInstance().info("Id de la sesion : " + configuration.getSession())
        ServicioLog.getInstance().info("Puerto establecido :" + configuration.getPuerto())
        ServicioLog.getInstance().info("Cargando dependencias...")
        await this.buildDependencyContainer(rawConfig)
        ServicioLog.getInstance().info("Las dependencias se han establecido correctamente")
        return configuration
    }
    
    private static cargarArgsEnv(): Map<string, string> {
        const getEnvironment = (data: string[], getKeyValue: (item: string) => [string, string]): Map<string, string> => {
            const items = new Map<string, string>();
            for (const item of data) {
                const [key, val] = getKeyValue(item);
                items.set(key, val);
            }
            return items;
        };
    
        const envArray = Object.entries(process.env).map(([key, value]) => `${key}=${value}`);
    
        return getEnvironment(envArray, (item: string): [string, string] => {
            const splits = item.split("=");
            const key = splits[0];
            const val = splits[1];
            return [key, val];
        });
    }
    
    private static buildConfiguration(rawConfig: Map<string, string>): Configuration {
        let configuration = Configuration.initialice(rawConfig)
        return configuration
    }
    
    private static buildLogDependecy (rawConfig: Map<string, string>){
        let configuration  = Configuration.getInstance()
        let args = configuration.getArgs()
    
        let loggerKey = configuration.getArg("LOGGER")
        
        let dictionary = new DependencyDictionary()
    
        let loggerDependecy =dictionary.findLoggerDependency(loggerKey,args)
        
    
        ServicioLog.initialize(loggerDependecy)
    }

    private static async buildDependencyContainer(rawConfig: Map<string, string>){
        let configuration  = Configuration.getInstance()
        let args = configuration.getArgs()
        let dependencyContainer = DependencyContainer.getInstance()
        let correcto:boolean = true; 
    
        let dictionary = new DependencyDictionary()

        if(correcto){
            ServicioLog.getInstance().info("Cargando dependencias PartidaRepoQuery")
            let keyPartidaRepoQuery = configuration.getArg("PARTIDA_REPOQUERY")
            let partidaRepoQueryDependency = dictionary.findPartidaRepoQueryDependency(keyPartidaRepoQuery,args)
            correcto = await dependencyContainer.setPartidaRepoQuery(partidaRepoQueryDependency)
            ServicioLog.getInstance().info("Se ha cargado correctamente PartidaRepoQuery")
        }
    
        if(correcto){
            ServicioLog.getInstance().info("Cargando dependencias PartidaRepoCommand")
            let keyPartidaRepoCommand = configuration.getArg("PARTIDA_REPOCOMMAND")
            let partidaRepoCommandDependency = dictionary.findPartidaRepoCommandDependency(keyPartidaRepoCommand,args)
            correcto = await dependencyContainer.setPartidaRepoCommand(partidaRepoCommandDependency)
            ServicioLog.getInstance().info("Se ha cargado correctamente PartidaRepoCommand")    
        }
        
        if(correcto){
            ServicioLog.getInstance().info("Cargando dependencias UsuarioRepoQuery")
            let keyUsuarioRepoQuery = configuration.getArg("USUARIO_REPOQUERY")
            let usuarioRepoQueryDependency = dictionary.findUsuarioRepoQueryDependency(keyUsuarioRepoQuery,args)
            correcto = await dependencyContainer.setUsuarioRepoQuery(usuarioRepoQueryDependency)
            ServicioLog.getInstance().info("Se ha cargado correctamente UsuarioRepoQuery")
        }
    
        if(correcto){
            ServicioLog.getInstance().info("Cargando dependencias UsuarioRepoCommand")
            let keyUsuarioRepoCommand = configuration.getArg("USUARIO_REPOCOMMAND")
            let usuarioRepoCommandDependency = dictionary.findUsuarioRepoCommandDependency(keyUsuarioRepoCommand,args)
            correcto = await dependencyContainer.setUsuarioRepoCommand(usuarioRepoCommandDependency)
            ServicioLog.getInstance().info("Se ha cargado correctamente UsuarioRepoCommand")    
        }
        
        if(correcto){
            ServicioLog.getInstance().info("Cargando dependencias PersonajeRepoQuery")
            let keyPersonajeRepoQuery = configuration.getArg("PERSONAJE_REPOQUERY")
            let personajeRepoQueryDependency = dictionary.findPersonajeRepoQueryDependency(keyPersonajeRepoQuery,args)
            correcto = await dependencyContainer.setPersonajeRepoQuery(personajeRepoQueryDependency)
            ServicioLog.getInstance().info("Se ha cargado correctamente PersonajeRepoQuery")
        }
    
        if(correcto){
            ServicioLog.getInstance().info("Cargando dependencias PersonajeRepoCommand")
            let keyPersonajeRepoCommand = configuration.getArg("PERSONAJE_REPOCOMMAND")
            let personajeRepoCommandDependency = dictionary.findPersonajeRepoCommandDependency(keyPersonajeRepoCommand,args)
            correcto = await dependencyContainer.setPersonajeRepoCommand(personajeRepoCommandDependency)
            ServicioLog.getInstance().info("Se ha cargado correctamente PersonajeRepoCommand")    
        }
        
        if(correcto){
            ServicioLog.getInstance().info("Cargando dependencias TiendaRepoQuery")
            let keyTiendaRepoQuery = configuration.getArg("TIENDA_REPOQUERY")
            let tiendaRepoQueryDependency = dictionary.findTiendaRepoQueryDependency(keyTiendaRepoQuery,args)
            correcto = await dependencyContainer.setTiendaRepoQuery(tiendaRepoQueryDependency)
            ServicioLog.getInstance().info("Se ha cargado correctamente TiendaRepoQuery")
        }
    
        if(correcto){
            ServicioLog.getInstance().info("Cargando dependencias TiendaRepoCommand")
            let keyTiendaRepoCommand = configuration.getArg("TIENDA_REPOCOMMAND")
            let tiendaRepoCommandDependency = dictionary.findTiendaRepoCommandDependency(keyTiendaRepoCommand,args)
            correcto = await dependencyContainer.setTiendaRepoCommand(tiendaRepoCommandDependency)
            ServicioLog.getInstance().info("Se ha cargado correctamente TiendaRepoCommand")    
        }

        if(!correcto){
            //TODO cambiar el tipo de error
            throw new ErrorCircuitBreaker("CONFIG","Error en la carga de dependencias")
        }
    }
}