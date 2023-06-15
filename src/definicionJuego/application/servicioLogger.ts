import { Logger } from "../../commons/report/Logger.js";
import { RepositoryLoggerImplFicheros } from "./../infraestructura/RepositoryLogger.js";
import { DTOLoggerQueryParams } from "../domain/dto/DTOLoggerQueryParams.js";

export class ServicioLogger {

    private static instance: ServicioLogger;
    private repo: RepositoryLoggerImplFicheros;

    private constructor(repo: RepositoryLoggerImplFicheros) {
        this.repo = repo;
    }

    public static getInstance(): ServicioLogger {
        if (ServicioLogger.instance == undefined) {
            throw new Error("No se ha inicializado el repositorio en arranque");
        }
        return ServicioLogger.instance;
    }

    /**
     * Método para inicializar el repositorio durante la inicialización de la aplicación
     * Si se realiza en otro punto arrojará una excepción
     * 
     * @param repo Instancia del repositorio a utilizar
     */
    public static initialize(repo: RepositoryLoggerImplFicheros): ServicioLogger {
        if (ServicioLogger.instance != undefined) {
            throw new Error("Se ha intentado inicializar el repositorio fuera del arranque");
        }
        ServicioLogger.instance = new ServicioLogger(repo);
        return ServicioLogger.instance;
    }

    public findFilter(loggerDTO : DTOLoggerQueryParams): Array<Logger> {
            return this.repo.findFilter(loggerDTO);
    }

}