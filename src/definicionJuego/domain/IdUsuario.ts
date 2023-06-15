
export class IdUsuario {
    private idNuevo: string;
    private idActual: string;

    public constructor(idNuevo:string,idActual:string) {
        this.idNuevo = idNuevo;
        this.idActual = idActual;
    }

    public getIdActual() {
        return this.idActual;
    }

    public getIdNuevo() {
        return this.idNuevo;
    }

}