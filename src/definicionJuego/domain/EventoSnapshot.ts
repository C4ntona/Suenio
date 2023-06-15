export class EventoSnapshot<T> {

    private fecha: number;
    private entidad: string;
    private evento: string;
    private identificador?: string;
    private datos?: T | undefined;
    
    public constructor(fecha: Date, entidad: string, evento: string, datos?: T, identificador?: string) {
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

    public getDatos(): T | undefined {
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