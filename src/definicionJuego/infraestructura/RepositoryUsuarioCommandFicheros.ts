import { Usuario } from "../domain/Usuario.js"
import { DTOEventoUsuario } from "../domain/dto/DTOEventoUsuario.js";
import { APIException } from '../../commons/APIException.js';
import { EventoUsuario } from "../domain/EventoUsuario.js";
import { UsuarioCommand } from "../domain/UsuarioRepositoryCommand.js";
import { UsuarioQuery } from "../domain/UsuarioRepositoryQuery.js";
import { DependencyContainer } from "../../commons/dependecy-container/DependencyContainer.js";
import { Executor, Initializable } from "../../commons/dependecy-container/Dependency.js";
import { ServicioLog } from "../../commons/report/ServicioLog.js";
import * as fs from 'fs';
import { IdUsuario } from "../domain/IdUsuario.js";

export class RepositoryUsuarioCommandFicheros implements UsuarioCommand,Initializable{
    
    Initializable: Executor<Initializable> = Executor.define(this.onInit.bind(this));
    public static NAME = "RepositoryUsuarioCommandFicheros";

    private repoQuery: UsuarioQuery;

    public constructor() {
        this.repoQuery = DependencyContainer.getInstance().getUsuarioRepoQuery()
    }
    modifyId(IdUsuario: IdUsuario): Promise<Usuario> {
        throw new Error("Method not implemented.");
    }

    getName(): string {
       return RepositoryUsuarioCommandFicheros.NAME
    }

    public async onInit():Promise <boolean> {
        try {
            this.cargarUsuarioEventos();
            return true;
        } catch (error) {
            ServicioLog.getInstance().info(`Se ha producido un error durante la inicialización de la dependencia ${this.getName()} ` + error as string)
            return false;
        }
    }

    public onExit(): boolean {
        return true
    }

    public async insert(ObjetoUsuario: Usuario):Promise <Usuario> {
        let objeto = this.repoQuery.find(ObjetoUsuario.getIdentificador())
        if (objeto != undefined) {
            throw new APIException(409, "PEI0001", "Ya existe un Usuario con el código: " + ObjetoUsuario.getIdentificador());
        }
        this.repoQuery.insert(ObjetoUsuario)
        let objEvento: EventoUsuario = new EventoUsuario(new Date(), "Usuario", "Insert", ObjetoUsuario)
        this.crearFicheroEventos(objEvento)
        return ObjetoUsuario;
    }

    public async modify(ObjetoUsuario: Usuario):Promise <Usuario> {
        let objeto = this.repoQuery.find(ObjetoUsuario.getIdentificador());
        if (objeto == undefined) {
            throw new APIException(404, "PEM0001", "El Usuario con el código " + ObjetoUsuario.getIdentificador() + " no existe")
        }
        let objEvento: EventoUsuario = new EventoUsuario(new Date(), "Usuario", "Modify", ObjetoUsuario, ObjetoUsuario.getIdentificador())
        this.repoQuery.insert(ObjetoUsuario)
        this.crearFicheroEventos(objEvento)
        return ObjetoUsuario
    }

    public async delete(identificador: string):Promise <Usuario> {
        let objeto = await this.repoQuery.find(identificador);
        if (objeto == undefined) {
            throw new APIException(404, "PED0001", "El Usuario con el código " + identificador + " no existe")
        }
        let objEvento: EventoUsuario = new EventoUsuario(new Date(), "Usuario", "Delete", undefined, identificador)
        this.repoQuery.delete(identificador)
        this.crearFicheroEventos(objEvento);
        return objeto
    }

    private crearFicheroEventos(objeto: EventoUsuario): void {
        if (!fs.existsSync("./resources/eventos.json")) {
            let data: [] = [];
            fs.writeFileSync("./resources/eventos.json", JSON.stringify(data));
        }
        let jsonString = fs.readFileSync('./resources/eventos.json', 'utf-8');
        let lista = JSON.parse(jsonString);
        lista.push(objeto);
        fs.writeFileSync("./resources/eventos.json", JSON.stringify(lista));
    }

    private cargarUsuarioEventos(): boolean {
        let eventos = [];
        try {
            eventos = this.leerEventosFichero()
        } catch (error) {
            throw new Error("El fichero está mal formado y no se puede interpretar.")
        }
        eventos.forEach((event: EventoUsuario) => {
            let datos = event.getDatos()
            if (datos != undefined) {
                this.repoQuery.insert(datos)
            } else {
                this.repoQuery.delete(event.getIdentificador() as string)
            }
        })
        return true;
    }

    private leerEventosFichero(): EventoUsuario[] {
        let listaEventosUsuario: EventoUsuario[] = []
        if (!fs.existsSync("./resources/eventos.json")) {
            let data: [] = [];
            fs.writeFileSync("./resources/eventos.json", JSON.stringify(data));
        }
        const contenidoArchivo = fs.readFileSync("./resources/eventos.json", "utf-8")
        JSON.parse(contenidoArchivo).forEach((event: DTOEventoUsuario) => {
            if (event.entidad == "Usuario") {
                const identificador = event.identificador
                let datos: Usuario | undefined = undefined
                if (event.datos) {
                    // let personaje: string[] = this.buildPersonajesVersiones(event.datos.personaje)
                    datos = new Usuario(event.datos.id,event.datos.nombre,event.datos.password,event.datos.email,event.datos.personajes)
                }
                const aux: EventoUsuario = new EventoUsuario(new Date(event.fecha), event.entidad, event.evento, datos, identificador);
                listaEventosUsuario.push(aux)
            }
        })

        return listaEventosUsuario;
    }

    // private buildPersonajesVersiones(parametros:string[]):string[]{
    //     let listaParametros : string[]=[];
    //     parametros.forEach((dto:string)=>{
    //         listaParametros.push(dto);
    //     })
    //     return listaParametros
    // }  

}