import { Tienda } from "./Tienda";

export class EventoTienda {

    private fecha: number;
    private entidad: string;
    private evento: string;
    private identificador?: string;
    private datos?: Tienda;
    
    public constructor(fecha: Date, entidad: string, evento: string, datos?: Tienda, identificador?: string) {
        this.fecha = fecha.getTime();
        this.entidad = entidad;
        this.evento = evento;
        if (datos!=null){
            this.datos = datos
        }
        if (identificador!=null) {
            this.identificador = identificador
        }
    }
    
    public getFecha(): number {
        return this.fecha
    }
    
    public getEntidad(): string {
        return this.entidad
    }

    public getevento(): string {
        return this.evento
    }
    
    public getDatos(): Tienda|undefined {
        return this.datos
    }

    public getIdentificador():string|undefined{
        return this.identificador;
    }

    public setEntidad(entidad: string) {
        this.entidad = entidad
    }

    public setEvento(evento: string) {
        this.evento = evento
    }

    public setDatos(datos: any) {
        this.datos = datos
    }

}