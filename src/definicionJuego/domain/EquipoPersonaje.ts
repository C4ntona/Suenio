import { DTOEquipoPersonaje } from "./dto/DTOEquipoPersonaje";

export class EquipoPesonaje {
    private nombreEquipo: string;
    
    constructor(nombreEquipo: string) {
        this.nombreEquipo = nombreEquipo;
    }
    
    //Getters
    get getNombreEquipo() {
        return this.nombreEquipo;
    }
  
    set setNombreEquipo(equipo: string) {
        this.nombreEquipo = equipo;
    }
    
    public asDTO():DTOEquipoPersonaje{
        return new DTOEquipoPersonaje(this.nombreEquipo)
    }
}