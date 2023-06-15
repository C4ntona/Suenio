export class Snapshot {

    private timestamp: number
    private fecha: Date
    private nombre: string;

    public constructor(timestamp:number,nombre:string) {
        this.timestamp = timestamp
        this.fecha = new Date();
        this.nombre = nombre;
    }

    public getFecha(): Date {
        return this.fecha;
    }

    public getTimestamp(): number {
        return this.timestamp;
    }

    public getNombre() {
        return this.nombre;
    }

    public setNombre(nombre: string) {
        this.nombre = nombre;
    }

}