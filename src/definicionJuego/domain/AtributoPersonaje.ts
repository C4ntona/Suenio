import { DTOAtributoPersonaje } from "./dto/DTOAtributosPersonaje";

export class AtributoPersonaje {
    private fuerza: number;
    private agilidad : number;
    private constitucion: number;
    private inteligencia: number;
    private sabiduria: number;
    private carisma: number;
    
    constructor(fuerza:number,agilidad:number,constitucion:number,inteligencia:number,sabiduria:number,carisma:number) {
        this.fuerza = fuerza;
        this.agilidad = agilidad;
        this.constitucion = constitucion;
        this.inteligencia = inteligencia;
        this.sabiduria = sabiduria;
        this.carisma = carisma;
    }
    
    //Getters
    get getFuerza() {
        return this.fuerza;
    }
    get getAgilidad(){
        return this.agilidad;
    }
    get getConstitucion() {
        return this.constitucion;
    }
    get getinteligencia() {
        return this.inteligencia;
    }
    get getSabiduria() {
        return this.sabiduria;
    }
    get getCarisma() {
        return this.carisma;
    }

    //Setters

    set setFuerza(fuerza: number) {
        this.fuerza = fuerza;
    }
    set setAgilidad(agilidad: number){
        this.agilidad = agilidad;
    }

    set setConstitucion(constitucion: number) {
        this.constitucion = constitucion;
    }
    set setinteligencia(inteligencia: number) {
        this.inteligencia = inteligencia;
    }
    set setSabiduria(sabiduria: number) {
        this.sabiduria = sabiduria;
    }
    set setCarisma(carisma: number) {
        this.carisma = carisma;
    }
    
    public asDTO():DTOAtributoPersonaje{
        return new DTOAtributoPersonaje(this.fuerza,this.agilidad,this.constitucion,this.inteligencia,this.sabiduria,this.carisma)
    }
}