import { DTOPersonaje } from "./DTOPersonaje";

export class DTOEventoPersonaje {

    public fecha: number;
    public entidad: string;
    public evento: string;
    public identificador?: string;
    public datos?: DTOPersonaje;
    
    public constructor(fecha: Date, entidad: string, evento: string, datos?: DTOPersonaje, identificador?: string) {
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
    
}