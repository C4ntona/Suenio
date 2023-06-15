export class DTOFindAll {
    public identificador:string;
    public nombre:string;

    public constructor(identificador:string,nombre:string){
        this.identificador = identificador
        this.nombre = nombre
    }
    public validar(): boolean {
        return (
            typeof this.identificador === 'string' &&
            typeof this.nombre === 'string'
        )
    }
}
