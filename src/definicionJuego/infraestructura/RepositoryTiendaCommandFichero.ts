import { Tienda } from "../domain/Tienda.js"
import { DTOEventoTienda } from "../domain/dto/DTOEventoTienda.js";
import { APIException } from '../../commons/APIException.js';
import { EventoTienda } from "../domain/EventoTienda.js";
import { TiendaRepositoryCommand } from "../domain/TiendaRepositoryCommand.js";
import { TiendaRepositoryQuery } from "../domain/TiendaRepositoryQuery.js";
import { DependencyContainer } from "../../commons/dependecy-container/DependencyContainer.js";
import { Executor, Initializable } from "../../commons/dependecy-container/Dependency.js";
import { ServicioLog } from "../../commons/report/ServicioLog.js";
import * as fs from 'fs';

export class RepositoryTiendaCommandFicheros implements TiendaRepositoryCommand,Initializable{
    
    Initializable: Executor<Initializable> = Executor.define(this.onInit.bind(this));
    public static NAME = "RepositoryTiendaCommandFicheros";

    private repoQuery: TiendaRepositoryQuery;

    public constructor() {
        this.repoQuery = DependencyContainer.getInstance().getTiendaRepoQuery()
    }

    getName(): string {
       return RepositoryTiendaCommandFicheros.NAME
    }

    public async onInit():Promise <boolean>{
        try {
            this.cargarTiendaEventos();
            return true;
        } catch (error) {
            ServicioLog.getInstance().info(`Se ha producido un error durante la inicialización de la dependencia ${this.getName()} ` + error as string)
            return false;
        }
    }

    public onExit(): boolean {
        return true
    }

    public async insert(ObjetoTienda: Tienda):Promise <Tienda> {
        let objeto = this.repoQuery.find(ObjetoTienda.getIdentificador())
        if (objeto != undefined) {
            throw new APIException(409, "TAI0001", "Ya existe un Tienda con el código: " + ObjetoTienda.getIdentificador());
        }
        this.repoQuery.insert(ObjetoTienda)
        let objEvento: EventoTienda = new EventoTienda(new Date(), "Tienda", "Insert", ObjetoTienda)
        this.crearFicheroEventos(objEvento)
        return ObjetoTienda;
    }

    public async modify(ObjetoTienda: Tienda):Promise <Tienda> {
        let objeto = this.repoQuery.find(ObjetoTienda.getIdentificador());
        if (objeto == undefined) {
            throw new APIException(404, "TAM0001", "La Tienda con el código " + ObjetoTienda.getIdentificador() + " no existe")
        }
        let objEvento: EventoTienda = new EventoTienda(new Date(), "Tienda", "Modify", ObjetoTienda, ObjetoTienda.getIdentificador())
        this.repoQuery.insert(ObjetoTienda)
        this.crearFicheroEventos(objEvento)
        return ObjetoTienda
    }

    public async delete(identificador: string):Promise <Tienda> {
        let objeto = await this.repoQuery.find(identificador);
        if (objeto == undefined) {
            throw new APIException(404, "TAD0001", "La Tienda con el código " + identificador + " no existe")
        }
        let objEvento: EventoTienda = new EventoTienda(new Date(), "Tienda", "Delete", undefined, identificador)
        this.repoQuery.delete(identificador)
        this.crearFicheroEventos(objEvento);
        return objeto
    }

    private crearFicheroEventos(objeto: EventoTienda): void {
        if (!fs.existsSync("./resources/eventos.json")) {
            let data: [] = [];
            fs.writeFileSync("./resources/eventos.json", JSON.stringify(data));
        }
        let jsonString = fs.readFileSync('./resources/eventos.json', 'utf-8');
        let lista = JSON.parse(jsonString);
        lista.push(objeto);
        fs.writeFileSync("./resources/eventos.json", JSON.stringify(lista));
    }

    private cargarTiendaEventos(): boolean {
        let eventos = [];
        try {
            eventos = this.leerEventosFichero()
        } catch (error) {
            throw new Error("El fichero está mal formado y no se puede interpretar.")
        }
        eventos.forEach((event: EventoTienda) => {
            let datos = event.getDatos()
            if (datos != undefined) {
                this.repoQuery.insert(datos)
            } else {
                this.repoQuery.delete(event.getIdentificador() as string)
            }
        })
        return true;
    }

    private leerEventosFichero(): EventoTienda[] {
        let listaEventosTienda: EventoTienda[] = []
        if (!fs.existsSync("./resources/eventos.json")) {
            let data: [] = [];
            fs.writeFileSync("./resources/eventos.json", JSON.stringify(data));
        }
        const contenidoArchivo = fs.readFileSync("./resources/eventos.json", "utf-8")
        JSON.parse(contenidoArchivo).forEach((event: DTOEventoTienda) => {
            if (event.entidad == "Tienda") {
                const identificador = event.identificador
                let datos: Tienda | undefined = undefined
                if (event.datos) {
                    datos = new Tienda(event.datos.id,event.datos.nombre,event.datos.precio,event.datos.descripcion)
                }
                const aux: EventoTienda = new EventoTienda(new Date(event.fecha), event.entidad, event.evento, datos, identificador);
                listaEventosTienda.push(aux)
            }
        })

        return listaEventosTienda;
    }

}