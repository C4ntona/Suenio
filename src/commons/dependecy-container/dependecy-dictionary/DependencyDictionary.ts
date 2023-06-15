// import { RepositoryUnidadTestCommandFicheros } from "./../../../definicionJuego/infraestructura/RepositoryUnidadTestCommandFicheros";
// // import { RepositoryUnidadTestQueryFicheros } from "./../../../definicionJuego/infraestructura/RepositoryUnidadTestQueryFicheros";
// import { RepositoryUnidadTestCommandMongo } from "./../../../definicionTest/infraestructura/RepositoryUnidadTestCommandMongo";
// import { RepositoryBateriaUnidadTestCommandMongo } from "./../../../definicionTest/infraestructura/RepositoryBateriaUnidadTestCommandMongo";
import { RepositoryPersonajeCommandFicheros } from "./../../../definicionJuego/infraestructura/RepositoryPersonajeCommandFicheros";
import { RepositoryPersonajeQueryFicheros } from "./../../../definicionJuego/infraestructura/RepositoryPersonajeQueryFichero";
import { RepositoryUsuarioCommandFicheros } from "./../../../definicionJuego/infraestructura/RepositoryUsuarioCommandFicheros";
import { RepositoryUsuarioQueryFicheros } from "./../../../definicionJuego/infraestructura/RepositoryUsuarioQueryFicheros";
import { RepositoryPartidaCommandFicheros } from "./../../../definicionJuego/infraestructura/RepositoryPartidaCommandFicheros";
import { RepositoryPartidaQueryFicheros } from "./../../../definicionJuego/infraestructura/RepositoryPartidaQueryFicheros";
import { RepositoryTiendaCommandFicheros } from "./../../../definicionJuego/infraestructura/RepositoryTiendaCommandFichero";
import { RepositoryTiendaQueryFicheros } from "./../../../definicionJuego/infraestructura/RepositoryTiendaQueryFichero";
import { LoggerConsole } from "../../report/LoggerConsole";
import { LoggerFichero } from "../../report/LoggerFichero";
import { LoggerInterface } from "../../report/LoggerInterface";
import { RepositoryUsuarioQueryMongo } from "../../../definicionJuego/infraestructura/RepositoryUsuarioQueryMongo";
import { RepositoryUsuarioCommandMongo } from "../../../definicionJuego/infraestructura/RepositoryUsuarioCommandMongo";
import { RepositoryPersonajeQueryMongo } from "../../../definicionJuego/infraestructura/RepositoryPersonajeQueryMongo";
import { RepositoryPersonajeCommandMongo } from "../../../definicionJuego/infraestructura/RepositoryPersonajeCommandMongo";
import { RepositoryPartidaQueryMongo } from "../../../definicionJuego/infraestructura/RepositoryPartidaQueryMongo";
import { RepositoryPartidaCommandMongo } from "../../../definicionJuego/infraestructura/RepositoryPartidaCommandMongo";
import { RepositoryTiendaQueryMongo } from "../../../definicionJuego/infraestructura/RepositoryTiendaQueryMongo";
import { RepositoryTiendaCommandMongo } from "../../../definicionJuego/infraestructura/RepositoryTiendaCommandMongo";

export class DependencyDictionary {

    public findLoggerDependency(code: string, args: Map<string, string>): LoggerInterface {
        switch (code) {
            case "LoggerFichero":
                return new LoggerFichero(args)

            default:
                return new LoggerConsole(args)
        }
    }

    public findPartidaRepoQueryDependency(code: string, args: Map<string, string>) {
        switch (code) {
            case "RepositoryPartidaQueryFicheros":
                return new RepositoryPartidaQueryFicheros()
            case "RepositoryPartidaQueryMongo":
                return new RepositoryPartidaQueryMongo(args)
            default:
                throw new Error("No se ha encontrado la dependencia de el repositorio Partida RepoQuery")
        }
    }
    
    public findPartidaRepoCommandDependency(code: string, args: Map<string, string>) {
        switch (code) {
            case "RepositoryPartidaCommandFicheros":
                return new RepositoryPartidaCommandFicheros()
            case "RepositoryPartidaCommandMongo":
                return new RepositoryPartidaCommandMongo(args)
            default:
                throw new Error("No se ha encontrado la dependencia de el repositorio Partida RepoCommand")
        }
    }


    public findUsuarioRepoQueryDependency(code: string, args: Map<string, string>) {
        switch (code) {
            case "RepositoryUsuarioQueryFicheros":
                return new RepositoryUsuarioQueryFicheros()
            case "RepositoryUsuarioQueryMongo":
                return new RepositoryUsuarioQueryMongo(args)
            default:
                throw new Error("No se ha encontrado la dependencia de el repositorio Usuario RepoQuery")
        }
    }

    public findUsuarioRepoCommandDependency(code: string, args: Map<string, string>) {
        switch (code) {
            case "RepositoryUsuarioCommandFicheros":
                return new RepositoryUsuarioCommandFicheros()
            case "RepositoryUsuarioCommandMongo":
                return new RepositoryUsuarioCommandMongo(args)
            default:
                throw new Error("No se ha encontrado la dependencia de el repositorio Usuario RepoCommand")
        }
    }

    public findPersonajeRepoQueryDependency(code: string, args: Map<string, string>) {
        switch (code) {
            case "RepositoryPersonajeQueryFicheros":
                return new RepositoryPersonajeQueryFicheros()
            case "RepositoryPersonajeQueryMongo":
                return new RepositoryPersonajeQueryMongo(args)
            default:
                throw new Error("No se ha encontrado la dependencia de el repositorio Personaje RepoQuery")
        }
    }

    public findPersonajeRepoCommandDependency(code: string, args: Map<string, string>) {
        switch (code) {
            case "RepositoryPersonajeCommand":
                return new RepositoryPersonajeCommandFicheros()
            case "RepositoryPersonajeCommandMongo":
                return new RepositoryPersonajeCommandMongo(args)
            default:
                throw new Error("No se ha encontrado la dependencia de el repositorio Personaje RepoCommand")
        }
    }

    public findTiendaRepoQueryDependency(code: string, args: Map<string, string>) {
        switch (code) {
            case "RepositoryTiendaQueryFicheros":
                return new RepositoryTiendaQueryFicheros()
            case "RepositoryTiendaQueryMongo":
                return new RepositoryTiendaQueryMongo(args)
            default:
                throw new Error("No se ha encontrado la dependencia de el repositorio Tienda RepoQuery")
        }
    }

    public findTiendaRepoCommandDependency(code: string, args: Map<string, string>) {
        switch (code) {
            case "RepositoryTiendaCommand":
                return new RepositoryTiendaCommandFicheros()
            case "RepositoryTiendaCommandMongo":
                return new RepositoryTiendaCommandMongo(args)
            default:
                throw new Error("No se ha encontrado la dependencia de el repositorio Tienda RepoCommand")
        }
    }
}