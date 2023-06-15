import { DTOUsuario } from "./DTOUsuario";

export class DTOEventoUsuario {

    public fecha: number;
    public entidad: string;
    public evento: string;
    public identificador?: string;
    public datos?: DTOUsuario;

    public constructor(fecha: Date, entidad: string, evento: string, datos?: DTOUsuario, identificador?: string) {
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