export class DTOEventoSnapshot {
    
    public fecha: number;
    public entidad: string;
    public evento: string;
    public identificador?: string;
    public datos?: any;

    public constructor(fecha: number, entidad: string, evento: string, datos?: any, identificador?: string) {
        this.fecha = fecha;
        this.entidad = entidad;
        this.evento = evento;
        this.datos = datos;
        if (datos!=undefined){
            this.datos = datos
        }
        if (identificador!=undefined) {
            this.identificador = identificador
        }
    }

}