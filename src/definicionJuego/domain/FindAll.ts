import { DTOFindAll } from "./dto/DTOFindAll";

export class FindAll{
    private identificador:string;
    private nombre:string;

    public constructor(identificador:string, nombre:string){
        this.identificador = identificador
        this.nombre = nombre
    }
    
    public getIdentificador():string{
        return this.identificador
    }
    public getNombre():string{
        return this.nombre
    }
    public setIdentificador(identificador:string){
        this.identificador = identificador
    }
    public setNombre(nombre:string){
        this.nombre = nombre
    }

    public asDTO():DTOFindAll{
        return new DTOFindAll(this.identificador,this.nombre)
    }
}