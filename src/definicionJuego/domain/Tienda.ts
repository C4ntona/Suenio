import { DTOTienda } from "./dto/DTOTienda";

export class Tienda {

    private identificador: string;
    private nombre: string;
    private precio: number;
    private descripcion: string;

    public constructor(identificador:string,nombre:string,precio:number,descripcion:string) {
        this.identificador = identificador;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
    }

    public getIdentificador() {
        return this.identificador;
    }

    public getNombre() {
        return this.nombre;
    }
    
    public getPrecio() {
     
        return this.precio;
    }

    public getDescripcion() {
        return this.descripcion;
    }
    
    public setIdentificador(identificador: string) {
        this.identificador = identificador;
    }

    public setNombre(nombre: string) {
        this.nombre = nombre;
    }

    public setPrecio(precio: number) {
        this.precio = precio;
    }

    public setDescripcion(descripcion: string) {
        this.descripcion = descripcion;
    }

    public asDTO():DTOTienda{
        return new DTOTienda(this.identificador,this.nombre,this.precio,this.descripcion)
    }
}