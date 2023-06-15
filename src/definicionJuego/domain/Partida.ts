import { DTOPartida } from "./dto/DTOPartida";

export class Partida {

    private identificador: string;
    private nombre: string;
    private master: string;
    private historial: string;
    private personajes: string[]=[];

    public constructor(identificador:string,nombre:string,master:string,historial:string,personajes:string[]) {
        this.identificador = identificador;
        this.nombre = nombre;
        this.master = master;
        this.historial = historial;
        this.personajes = personajes;
    }

    public getIdentificador() {
        return this.identificador;
    }

    public getNombre() {
        return this.nombre;
    }

    public getMaster() {
        
        return this.master;
    }
    public getHistorial() {
     
        return this.historial;
    }
    public getPersonajes() {
        return this.personajes;
    }
    
    public setIdentificador(identificador: string) {
        this.identificador = identificador;
    }

    public setNombre(nombre: string) {
        this.nombre = nombre;
    }

    public setMaster(master: string) {
        this.master = master;
    }

    public setHistorial(historial: string) {
        this.historial = historial;
    }

    public setPersonajes(Personajes: string[]) {
        this.personajes = Personajes;
    }
    
    public añadirParametro(parametro: string) {
        this.personajes.push(parametro);
    }

    public asDTO():DTOPartida{
        return new DTOPartida(this.identificador,this.nombre,this.master,this.historial,this.personajes)
    }
}