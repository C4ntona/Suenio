import { Personaje } from "./Personaje.js";
import { DTOUsuario } from "./dto/DTOUsuario.js";
import { DTOPersonaje } from "./dto/DTOPersonaje.js";

export class Usuario {

    private identificador: string;
    private nombre: string;
    private password: string;
    private email: string;
    private personajes: string[]=[];

    public constructor(identificador:string,nombre:string,password:string,email:string,personajes:string[]) {
        this.identificador = identificador;
        this.nombre = nombre;
        this.password = password;
        this.email = email;
        this.personajes = personajes;
    }

    public getIdentificador() {
        return this.identificador;
    }

    public getNombre() {
        return this.nombre;
    }

    public getpassword() {
        
        return this.password;
    }
    public getemail() {
     
        return this.email;
    }
    public getPersonajes() {
        return this.personajes;
    }
    
    public setIdentificador(identificador: string) {
        this.identificador = identificador;
    }

    public setNombre(nombre: string) {
        this.nombre = nombre;
    }

    public setpassword(password: string) {
        this.password = password;
    }

    public setemail(email: string) {
        this.email = email;
    }

    public setPersonajes(Personajes: string[]) {
        this.personajes = Personajes;
    }
    
    public añadirParametro(parametro: string) {
        this.personajes.push(parametro);
    }

    public asDTO():DTOUsuario{
        return new DTOUsuario(this.identificador,this.nombre,this.password,this.email,this.personajes)
    }
}