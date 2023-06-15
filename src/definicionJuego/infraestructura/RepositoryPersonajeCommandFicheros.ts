import { Personaje } from "../domain/Personaje.js"
import { DTOEventoPersonaje } from "../domain/dto/DTOEventoPersonaje.js";
import { APIException } from '../../commons/APIException.js';
import { EventoPersonaje } from "../domain/EventoPersonaje.js";
import { PersonajeRepositoryCommand } from "../domain/PersonajeRepositoryCommand.js";
import { PersonajeRepositoryQuery } from "../domain/PersonajeRepositoryQuery.js";
import { AtributoPersonaje } from "../domain/AtributoPersonaje.js";
import { HabilidadPersonaje } from "../domain/HabilidadPersonaje.js";
import { HechizosPersonaje } from "../domain/HechizoPersonaje.js";
import { EquipoPesonaje } from "../domain/EquipoPersonaje.js";
import { ObjetoPesonaje } from "../domain/ObjetoPersonaje.js";
import { DTOAtributoPersonaje } from "../domain/dto/DTOAtributosPersonaje.js";
import { DTOHabilidadPersonaje } from "../domain/dto/DTOHabilidadPersonaje.js";
import { DTOHechizoPersonaje } from "../domain/dto/DTOHechizosPersonaje.js";
import { DTOEquipoPersonaje } from "../domain/dto/DTOEquipoPersonaje.js";
import { DTOObjetoPesonaje } from "../domain/dto/DTOObjetoPersonaje.js";
import { DependencyContainer } from "../../commons/dependecy-container/DependencyContainer.js";
import { Executor, Initializable } from "../../commons/dependecy-container/Dependency.js";
import { ServicioLog } from "../../commons/report/ServicioLog.js";
import * as fs from 'fs';

export class RepositoryPersonajeCommandFicheros implements PersonajeRepositoryCommand,Initializable{
    
    Initializable: Executor<Initializable> = Executor.define(this.onInit.bind(this));
    public static NAME = "RepositoryPersonajeCommandFicheros";

    private repoQuery: PersonajeRepositoryQuery;

    public constructor() {
        this.repoQuery = DependencyContainer.getInstance().getPersonajeRepoQuery()
    }

    getName(): string {
       return RepositoryPersonajeCommandFicheros.NAME
    }

    public async onInit():Promise <boolean>{
        try {
            this.cargarPersonajeEventos();
            return true;
        } catch (error) {
            ServicioLog.getInstance().info(`Se ha producido un error durante la inicialización de la dependencia ${this.getName()} ` + error as string)
            return false;
        }
    }

    public onExit(): boolean {
        return true
    }

    public async insert(ObjetoPersonaje: Personaje):Promise <Personaje> {
        let objeto = this.repoQuery.find(ObjetoPersonaje.getIdentificador())
        if (objeto != undefined) {
            throw new APIException(409, "PEI0001", "Ya existe un Personaje con el código: " + ObjetoPersonaje.getIdentificador());
        }
        this.repoQuery.insert(ObjetoPersonaje)
        let objEvento: EventoPersonaje = new EventoPersonaje(new Date(), "Personaje", "Insert", ObjetoPersonaje)
        this.crearFicheroEventos(objEvento)
        return ObjetoPersonaje;
    }

    public async modify(ObjetoPersonaje: Personaje):Promise <Personaje> {
        let objeto = this.repoQuery.find(ObjetoPersonaje.getIdentificador());
        if (objeto == undefined) {
            throw new APIException(404, "PEM0001", "El personaje con el código " + ObjetoPersonaje.getIdentificador() + " no existe")
        }
        let objEvento: EventoPersonaje = new EventoPersonaje(new Date(), "Personaje", "Modify", ObjetoPersonaje, ObjetoPersonaje.getIdentificador())
        this.repoQuery.insert(ObjetoPersonaje)
        this.crearFicheroEventos(objEvento)
        return ObjetoPersonaje
    }

    public async delete(identificador: string):Promise <Personaje> {
        let objeto = await this.repoQuery.find(identificador);
        if (objeto == undefined) {
            throw new APIException(404, "PED0001", "El personaje con el código " + identificador + " no existe")
        }
        let objEvento: EventoPersonaje = new EventoPersonaje(new Date(), "Personaje", "Delete", undefined, identificador)
        this.repoQuery.delete(identificador)
        this.crearFicheroEventos(objEvento);
        return objeto
    }

    private crearFicheroEventos(objeto: EventoPersonaje): void {
        if (!fs.existsSync("./resources/eventos.json")) {
            let data: [] = [];
            fs.writeFileSync("./resources/eventos.json", JSON.stringify(data));
        }
        let jsonString = fs.readFileSync('./resources/eventos.json', 'utf-8');
        let lista = JSON.parse(jsonString);
        lista.push(objeto);
        fs.writeFileSync("./resources/eventos.json", JSON.stringify(lista));
    }

    private cargarPersonajeEventos(): boolean {
        let eventos = [];
        try {
            eventos = this.leerEventosFichero()
        } catch (error) {
            throw new Error("El fichero está mal formado y no se puede interpretar.")
        }
        eventos.forEach((event: EventoPersonaje) => {
            let datos = event.getDatos()
            if (datos != undefined) {
                this.repoQuery.insert(datos)
            } else {
                this.repoQuery.delete(event.getIdentificador() as string)
            }
        })
        return true;
    }

    private leerEventosFichero(): EventoPersonaje[] {
        let listaEventosPersonaje: EventoPersonaje[] = []
        if (!fs.existsSync("./resources/eventos.json")) {
            let data: [] = [];
            fs.writeFileSync("./resources/eventos.json", JSON.stringify(data));
        }
        const contenidoArchivo = fs.readFileSync("./resources/eventos.json", "utf-8")
        JSON.parse(contenidoArchivo).forEach((event: DTOEventoPersonaje) => {
            if (event.entidad == "Personaje") {
                const identificador = event.identificador
                let datos: Personaje | undefined = undefined
                if (event.datos) {
                    let atributos: AtributoPersonaje[] = this.buildAtributosVersiones(event.datos.atributos)
                    let habilidades: HabilidadPersonaje[] = this.buildHabilidadesVersiones(event.datos.habilidades)
                    let hechizo: HechizosPersonaje[] = this.buildHechizoVersiones(event.datos.hechizos)
                    let equipo: EquipoPesonaje[] = this.buildEquipoVersiones(event.datos.equipo)
                    let objecto: ObjetoPesonaje[] = this.buildObjetoVersiones(event.datos.objetos)
                    datos = new Personaje(event.datos.id,event.datos.clase,event.datos.nombre,event.datos.raza,event.datos.nivel,event.datos.alineamiento,event.datos.experiencia,event.datos.trasfondo,event.datos.rasgos,event.datos.salud,
                        atributos,
                        habilidades,
                        hechizo,
                        equipo,
                        objecto)
                }
                const aux: EventoPersonaje = new EventoPersonaje(new Date(event.fecha), event.entidad, event.evento, datos, identificador);
                listaEventosPersonaje.push(aux)
            }
        })

        return listaEventosPersonaje;
    }
    
    private buildAtributosVersiones(parametros: DTOAtributoPersonaje[]): AtributoPersonaje[] {
        let listaParametros: AtributoPersonaje[] = []
        parametros.forEach((dto: DTOAtributoPersonaje) => {
            listaParametros.push(new AtributoPersonaje(dto.fuerza ,dto.agilidad,dto.constitucion,dto.inteligencia,dto.sabiduria,dto.carisma))
        });
        return listaParametros;
    }

    private buildHabilidadesVersiones(parametros: DTOHabilidadPersonaje[]): HabilidadPersonaje[] {
        let listaParametros: HabilidadPersonaje[] = []
        parametros.forEach((dto: DTOHabilidadPersonaje) => {
            listaParametros.push(new HabilidadPersonaje(dto.acrobatics,dto.animal_handling,dto.arcana,dto.athletics,dto.deception,dto.history,dto.insight,dto.intimidation,
                dto.investigation,dto.medicine,dto.nature,dto.perception,dto.performance,dto.persuasion,dto.religion,dto.sleight_ofhand,dto.stealth,dto.survival))
        });
        return listaParametros;
    }

    private buildHechizoVersiones(parametros:DTOHechizoPersonaje[]):HechizosPersonaje[]{
        let listaParametros : HechizosPersonaje[]=[];
        parametros.forEach((dto:DTOHechizoPersonaje)=>{
            listaParametros.push(new HechizosPersonaje(dto.nombreHechizo));
        })
        return listaParametros
    }  

    private buildEquipoVersiones(parametros:DTOEquipoPersonaje[]):EquipoPesonaje[]{
        let listaParametros : EquipoPesonaje[]=[];
        parametros.forEach((dto:DTOEquipoPersonaje)=>{
            listaParametros.push(new EquipoPesonaje(dto.nombreEquipo));
        })
        return listaParametros
    }  

    private buildObjetoVersiones(parametros:DTOObjetoPesonaje[]):ObjetoPesonaje[]{
        let listaParametros : ObjetoPesonaje[]=[];
        parametros.forEach((dto:DTOObjetoPesonaje)=>{
            listaParametros.push(new ObjetoPesonaje(dto.nombreObjeto));
        })
        return listaParametros
    } 

}