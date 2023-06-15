import { DTOPartida } from "./DTOPartida";

export class DTOEventoPartida {

    public fecha: number;
    public entidad: string;
    public evento: string;
    public identificador?: string;
    public datos?: DTOPartida;

    public constructor(fecha: Date, entidad: string, evento: string, datos?: DTOPartida, identificador?: string) {
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