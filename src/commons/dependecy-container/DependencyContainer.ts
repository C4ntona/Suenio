import { PersonajeRepositoryCommand } from "../../definicionJuego/domain/PersonajeRepositoryCommand";
import { PersonajeRepositoryQuery } from "../../definicionJuego/domain/PersonajeRepositoryQuery";
import { PartidaRepositoryCommand } from "../../definicionJuego/domain/PartidaRepositoryCommand";
import { PartidaRepositoryQuery } from "../../definicionJuego/domain/PartidaRepositoryQuery";
import { UsuarioCommand } from "../../definicionJuego/domain/UsuarioRepositoryCommand";
import { UsuarioQuery } from "../../definicionJuego/domain/UsuarioRepositoryQuery";
import { TiendaRepositoryCommand } from "../../definicionJuego/domain/TiendaRepositoryCommand";
import { TiendaRepositoryQuery } from "../../definicionJuego/domain/TiendaRepositoryQuery";
import { Closeable, Executor, Initializable, Dependency } from "./Dependency";


export enum Executables {
    Initializable = "Initializable",
    Closeable = "Closeable"
}

export class DependencyContainer {
    private static instance: DependencyContainer
    private PersonajeRepoQuery: PersonajeRepositoryQuery | undefined
    private PersonajeRepoCommand: PersonajeRepositoryCommand | undefined
    private PartidaRepoQuery: PartidaRepositoryQuery | undefined
    private PartidaRepoCommand: PartidaRepositoryCommand | undefined
    private TiendaRepoQuery: TiendaRepositoryQuery | undefined
    private TiendaRepoCommand: TiendaRepositoryCommand | undefined
    private UsuarioRepoQuery: UsuarioQuery | undefined
    private UsuarioRepoCommand: UsuarioCommand | undefined

    private closeables: Executor<Closeable>[]

    private constructor() {
        this.closeables = []
    }

    public static getInstance(): DependencyContainer {
        if (DependencyContainer.instance == undefined) {
            DependencyContainer.instance = new DependencyContainer()
        }
        return DependencyContainer.instance;
    }

    public getCloseables(): Executor<Closeable>[] {
        return this.closeables
    }

    public pushExitable(dependecy: Executor<Closeable>) {
        this.closeables.push(dependecy)
    }

    public getPersonajeRepoCommand() {
        if (this.PersonajeRepoCommand != undefined) {
            return this.PersonajeRepoCommand
        }
        throw new Error("No esta instanciado el PersonajeRepoCommand en las dependencias")
    }

    public getPersonajeRepoQuery() {
        if (this.PersonajeRepoQuery != undefined) {
            return this.PersonajeRepoQuery
        }
        throw new Error("No esta instanciado PersonajeRepoQuery en las dependencias")
    }

    public getPartidaRepoCommand() {
        if (this.PartidaRepoCommand != undefined) {
            return this.PartidaRepoCommand
        }
        throw new Error("No esta instanciado PartidaRepoCommand en las dependencias")
    }

    public getPartidaRepoQuery() {
        if (this.PartidaRepoQuery != undefined) {
            return this.PartidaRepoQuery
        }
        throw new Error("No esta instanciado PartidaRepoQuery en las dependencias")
    }
    public getUsuarioRepoCommand() {
        if (this.UsuarioRepoCommand != undefined) {
            return this.UsuarioRepoCommand
        }
        throw new Error("No esta instanciado UsuarioRepoCommand en las dependencias")
    }
    public getUsuarioRepoQuery() {
        if (this.UsuarioRepoQuery != undefined) {
            return this.UsuarioRepoQuery
        }
        throw new Error("No esta instanciado UsuarioRepoQuery en las dependencias")
    }
    public getTiendaRepoCommand() {
        if (this.TiendaRepoCommand != undefined) {
            return this.TiendaRepoCommand
        }
        throw new Error("No esta instanciado TiendaRepoCommand en las dependencias")
    }
    public getTiendaRepoQuery() {
        if (this.TiendaRepoQuery != undefined) {
            return this.TiendaRepoQuery
        }
        throw new Error("No esta instanciado TiendaRepoQuery en las dependencias")
    }

    public async setPersonajeRepoCommand(dependency: PersonajeRepositoryCommand): Promise<boolean> {
        this.PersonajeRepoCommand = dependency
        return await this.evaluarExecutables(this.PersonajeRepoCommand)
    }

    public async setPersonajeRepoQuery(dependecy: PersonajeRepositoryQuery):  Promise<boolean> {
        this.PersonajeRepoQuery = dependecy
        return await this.evaluarExecutables(this.PersonajeRepoQuery)
    }

    public async setPartidaRepoCommand(dependecy: PartidaRepositoryCommand): Promise<boolean>{
        this.PartidaRepoCommand = dependecy
        return await this.evaluarExecutables(this.PartidaRepoCommand)
    }

    public async setPartidaRepoQuery(dependecy: PartidaRepositoryQuery): Promise<boolean>{
        this.PartidaRepoQuery = dependecy
        return await this.evaluarExecutables(this.PartidaRepoQuery)
    }

    public async setUsuarioRepoCommand(dependecy: UsuarioCommand) : Promise<boolean>{
        this.UsuarioRepoCommand = dependecy
        return await this.evaluarExecutables(this.UsuarioRepoCommand)
    }

    public async setUsuarioRepoQuery(dependecy: UsuarioQuery): Promise<boolean> {
        this.UsuarioRepoQuery = dependecy
        return await this.evaluarExecutables(this.UsuarioRepoQuery)
    }

    public async setTiendaRepoCommand(dependecy: TiendaRepositoryCommand) : Promise<boolean>{
        this.TiendaRepoCommand = dependecy
        return await this.evaluarExecutables(this.TiendaRepoCommand)
    }

    public async setTiendaRepoQuery(dependecy: TiendaRepositoryQuery): Promise<boolean> {
        this.TiendaRepoQuery = dependecy
        return await this.evaluarExecutables(this.TiendaRepoQuery)
    }

    public Close(): boolean {
        let status = true;
        this.closeables.forEach(async closeable => status = await closeable.execute());
        return status;
    }

    private async evaluarExecutables(dependencia: Dependency): Promise<boolean> {
        const keys = Object.keys(dependencia);
        let state = true;
        let index = 0;
        while(state && index < keys.length){
            state = await this.evaluarExecutable(keys[index], dependencia)
            index++;
        }
        return state;
    }

    private async evaluarExecutable(key: string, dependencia: Dependency): Promise<boolean> {
        let dep = (dependencia as any);
        switch (key) {
            case Executables.Initializable:
                if(dep[key] instanceof Executor) {
                    const executable = dep[key] as Executor<Initializable>
                    return await executable.execute();
                }
                return false;
            case Executables.Closeable:
                if(dep[key] instanceof Executor) {
                    const executable = dep[key] as Executor<Closeable>
                    this.pushExitable(executable)
                }
                return true;
            default:
                return true;
        }
    }

}