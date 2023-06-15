import { DTOHechizoPersonaje } from "./dto/DTOHechizosPersonaje";

export class HechizosPersonaje {
    private nombreHechizo: string;
    
    constructor(nombreHechizo:string) {
        this.nombreHechizo = nombreHechizo;
    }
    
    //Getters
    get getNombreHechizo() {
        return this.nombreHechizo;
    }
  
    set setNombreHechizo(hechizo: string) {
        this.nombreHechizo = hechizo;
    }
    
    public asDTO():DTOHechizoPersonaje{
        return new DTOHechizoPersonaje(this.nombreHechizo)
    }
}