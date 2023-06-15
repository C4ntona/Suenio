import { DTOObjetoPesonaje } from "./dto/DTOObjetoPersonaje";

export class ObjetoPesonaje {
    private nombreObjeto: string;
    
    constructor(nombreObjeto: string) {
        this.nombreObjeto = nombreObjeto;
    }
    
    //Getters
    get getNombreObjeto() {
        return this.nombreObjeto;
    }
  
    set setNombreObjeto(objeto: string) {
        this.nombreObjeto = objeto;
    }
    
    public asDTO():DTOObjetoPesonaje{
        return new DTOObjetoPesonaje(this.nombreObjeto)
    }
}