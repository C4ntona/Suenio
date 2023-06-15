import { Partida } from "../domain/Partida.js"
import { DTOEventoPartida } from "../domain/dto/DTOEventoPartida.js";
import { APIException } from '../../commons/APIException.js';
import { EventoPartida } from "../domain/EventoPartida.js";
import { PartidaRepositoryCommand } from "../domain/PartidaRepositoryCommand.js";
import { PartidaRepositoryQuery } from "../domain/PartidaRepositoryQuery.js";
import { DependencyContainer } from "../../commons/dependecy-container/DependencyContainer.js";
import { Executor, Initializable } from "../../commons/dependecy-container/Dependency.js";
import { ServicioLog } from "../../commons/report/ServicioLog.js";
import * as fs from 'fs';

export class RepositoryPartidaCommandFicheros implements PartidaRepositoryCommand,Initializable{
    
    Initializable: Executor<Initializable> = Executor.define(this.onInit.bind(this));
    public static NAME = "RepositoryPartidaCommandFicheros";

    private repoQuery: PartidaRepositoryQuery;

    public constructor() {
        this.repoQuery = DependencyContainer.getInstance().getPartidaRepoQuery()
    }

    getName(): string {
       return RepositoryPartidaCommandFicheros.NAME
    }

    public async onInit():Promise <boolean>{
        try {
            this.cargarPartidaEventos();
            return true;
        } catch (error) {
            ServicioLog.getInstance().info(`Se ha producido un error durante la inicialización de la dependencia ${this.getName()} ` + error as string)
            return false;
        }
    }

    public onExit(): boolean {
        return true
    }

    public async insert(ObjetoPartida: Partida):Promise <Partida> {
        let objeto = this.repoQuery.find(ObjetoPartida.getIdentificador())
        if (objeto != undefined) {
            throw new APIException(409, "PAI0001", "Ya existe un Partida con el código: " + ObjetoPartida.getIdentificador());
        }
        this.repoQuery.insert(ObjetoPartida)
        let objEvento: EventoPartida = new EventoPartida(new Date(), "Partida", "Insert", ObjetoPartida)
        this.crearFicheroEventos(objEvento)
        return ObjetoPartida;
    }

    public async modify(ObjetoPartida: Partida):Promise <Partida> {
        let objeto = this.repoQuery.find(ObjetoPartida.getIdentificador());
        if (objeto == undefined) {
            throw new APIException(404, "PAM0001", "La Partida con el código " + ObjetoPartida.getIdentificador() + " no existe")
        }
        let objEvento: EventoPartida = new EventoPartida(new Date(), "Partida", "Modify", ObjetoPartida, ObjetoPartida.getIdentificador())
        this.repoQuery.insert(ObjetoPartida)
        this.crearFicheroEventos(objEvento)
        return ObjetoPartida
    }

    public async delete(identificador: string):Promise <Partida> {
        let objeto = await this.repoQuery.find(identificador);
        if (objeto == undefined) {
            throw new APIException(404, "PAD0001", "La Partida con el código " + identificador + " no existe")
        }
        let objEvento: EventoPartida = new EventoPartida(new Date(), "Partida", "Delete", undefined, identificador)
        this.repoQuery.delete(identificador)
        this.crearFicheroEventos(objEvento);
        return objeto
    }

    private crearFicheroEventos(objeto: EventoPartida): void {
        if (!fs.existsSync("./resources/eventos.json")) {
            let data: [] = [];
            fs.writeFileSync("./resources/eventos.json", JSON.stringify(data));
        }
        let jsonString = fs.readFileSync('./resources/eventos.json', 'utf-8');
        let lista = JSON.parse(jsonString);
        lista.push(objeto);
        fs.writeFileSync("./resources/eventos.json", JSON.stringify(lista));
    }

    private cargarPartidaEventos(): boolean {
        let eventos = [];
        try {
            eventos = this.leerEventosFichero()
        } catch (error) {
            throw new Error("El fichero está mal formado y no se puede interpretar.")
        }
        eventos.forEach((event: EventoPartida) => {
            let datos = event.getDatos()
            if (datos != undefined) {
                this.repoQuery.insert(datos)
            } else {
                this.repoQuery.delete(event.getIdentificador() as string)
            }
        })
        return true;
    }

    private leerEventosFichero(): EventoPartida[] {
        let listaEventosPartida: EventoPartida[] = []
        if (!fs.existsSync("./resources/eventos.json")) {
            let data: [] = [];
            fs.writeFileSync("./resources/eventos.json", JSON.stringify(data));
        }
        const contenidoArchivo = fs.readFileSync("./resources/eventos.json", "utf-8")
        JSON.parse(contenidoArchivo).forEach((event: DTOEventoPartida) => {
            if (event.entidad == "Partida") {
                const identificador = event.identificador
                let datos: Partida | undefined = undefined
                if (event.datos) {
                    datos = new Partida(event.datos.id,event.datos.nombre,event.datos.master,event.datos.historial,event.datos.personajes)
                }
                const aux: EventoPartida = new EventoPartida(new Date(event.fecha), event.entidad, event.evento, datos, identificador);
                listaEventosPartida.push(aux)
            }
        })

        return listaEventosPartida;
    }

}