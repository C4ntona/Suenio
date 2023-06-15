import { DTOTienda } from "./DTOTienda";

export class DTOEventoTienda {

    public fecha: number;
    public entidad: string;
    public evento: string;
    public identificador?: string;
    public datos?: DTOTienda;

    public constructor(fecha: Date, entidad: string, evento: string, datos?: DTOTienda, identificador?: string) {
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