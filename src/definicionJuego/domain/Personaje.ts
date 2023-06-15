import { AtributoPersonaje } from "./AtributoPersonaje";
import { HabilidadPersonaje } from "./HabilidadPersonaje";
import { HechizosPersonaje } from "./HechizoPersonaje";
import { EquipoPesonaje } from "./EquipoPersonaje";
import { ObjetoPesonaje } from "./ObjetoPersonaje";
import { DTOPersonaje } from "./dto/DTOPersonaje";
import { DTOAtributoPersonaje } from "./dto/DTOAtributosPersonaje";
import { DTOHabilidadPersonaje } from "./dto/DTOHabilidadPersonaje";
import { DTOEquipoPersonaje } from "./dto/DTOEquipoPersonaje";
import { DTOHechizoPersonaje } from "./dto/DTOHechizosPersonaje";
import { DTOObjetoPesonaje } from "./dto/DTOObjetoPersonaje";

export class Personaje {
    private identificador: string;
    private clase : string;
    private nombre: string;
    private raza: string;
    private nivel: number;
    private alineamiento: string;
    private experiencia: number;
    private trasfondo:string;
    private rasgos:string;
    private salud: number;
    private atributos: AtributoPersonaje []=[];
    private habilidades: HabilidadPersonaje []=[]
    private hechizos: HechizosPersonaje []=[];
    private equipo: EquipoPesonaje []=[];
    private objetos: ObjetoPesonaje []=[];

    constructor(identificador:string,clase:string,nombre:string,raza:string,nivel:number,alineamiento:string,experiencia:number,trasfondo:string,rasgos:string,salud:number,
        atributos:AtributoPersonaje[],
        habilidades:HabilidadPersonaje[],
        hechizos:HechizosPersonaje[],
        equipo:EquipoPesonaje[],
        objetos:ObjetoPesonaje[]) {
        
        this.clase = clase;
        this.nombre = nombre;
        this.raza = raza;
        this.nivel = nivel;
        this.alineamiento = alineamiento;
        this.experiencia = experiencia;
        this.trasfondo = trasfondo;
        this.rasgos = rasgos;
        this.salud = salud;
        this.atributos = atributos;
        this.habilidades = habilidades;
        this.hechizos = hechizos;
        this.equipo = equipo;
        this.objetos = objetos;
        this.identificador = (identificador + nombre);
    }
    
    //Getters
    public  getIdentificador() {
        return this.identificador;
    }
    public  getClase(){
        return this.clase;
    }
    public  getNombre() {
        return this.nombre;
    }
    public  getRaza() {
        return this.raza;
    }
    public  getAtributos() {
        return this.atributos;
    }
    public  getNivel() {
        return this.nivel;
    }
    public  getAlineamiento() {
        return this.alineamiento;
    }
    public  getExperiencia() {
        return this.experiencia;
    }
    public  getHabilidades() {
        return this.habilidades;
    }
    public  getRasgos() {
        return this.rasgos;
    }
    public  getSalud() {
        return this.salud;
    }
    public  getTrasfondo() {
        return this.trasfondo;
    }
    public  getHechizos(){
        return this.hechizos;
    }
    public  getEquipo(){
        return this.equipo;
    }
    public  getObjeto(){
        return this.objetos;
    }
    
    //Setters

    public  setidentificador(identificador: string) {
        this.identificador = identificador;
    }
    public  setclase(clase: string){
        this.clase = clase;
    }

    public  setNombre(nombre: string) {
        this.nombre = nombre;
    }
    public  setraza(raza: string) {
        this.raza = raza;
    }
    public  setObjetos(objetos: ObjetoPesonaje[]) {
        this.objetos = objetos;
    }
    public setObjeto(objeto: ObjetoPesonaje){
        this.objetos.push(objeto);
    }
    public  setHechizos(hechizos: HechizosPersonaje[]) {
        this.hechizos = hechizos;
    }
    public setHechizo(hechizo: HechizosPersonaje){
        this.hechizos.push(hechizo);
    }
    public  setEquipacion(equipo: EquipoPesonaje[]) {
        this.equipo = equipo;
    }
    public setEquipo(equipo: EquipoPesonaje){
        this.equipo.push(equipo);
    }
    public  setAtributos(atributos: AtributoPersonaje[]) {
        this.atributos = atributos;
    }
    public setAtributo(atributos: AtributoPersonaje){
        this.atributos.push(atributos);
    }

    public asDTO():DTOPersonaje{
        
        let atributos: DTOAtributoPersonaje [] = this.buildDTOAtributoPersonajes();
        let habilidades: DTOHabilidadPersonaje [] = this.buildDTOHabilidadPersonaje();
        let hechizos: DTOHechizoPersonaje [] = this.buildDTOHechizosPersonaje();
        let equipo: DTOEquipoPersonaje [] = this.buildDTOEquipoPesonaje();
        let objetos: DTOObjetoPesonaje [] = this.buildDTOObjetoPesonaje();
        return new DTOPersonaje( this.identificador,this.clase,this.nombre,this.raza,this.nivel,this.alineamiento,this.experiencia,this.trasfondo,this.rasgos,
            this.salud,atributos,habilidades,hechizos,equipo,objetos
            )
    }
    
    private buildDTOAtributoPersonajes():DTOAtributoPersonaje[]{
        let listaParametros :DTOAtributoPersonaje[]= []
        this.atributos.forEach((parametro:AtributoPersonaje)=>{
            listaParametros.push(parametro.asDTO())
        })
        return listaParametros
    }

    private buildDTOHabilidadPersonaje():DTOHabilidadPersonaje[]{
        let listaParametros :DTOHabilidadPersonaje[]= []
        this.habilidades.forEach((parametro:HabilidadPersonaje)=>{
            listaParametros.push(parametro.asDTO())
        })
        return listaParametros
    }

    private buildDTOHechizosPersonaje():DTOHechizoPersonaje[]{
        let listaParametros :DTOHechizoPersonaje[]= []
        this.hechizos.forEach((parametro:HechizosPersonaje)=>{
            listaParametros.push(parametro.asDTO())
        })
        return listaParametros
    }

    private buildDTOEquipoPesonaje():DTOEquipoPersonaje[]{
        let listaParametros :DTOEquipoPersonaje[]= []
        this.equipo.forEach((parametro:EquipoPesonaje)=>{
            listaParametros.push(parametro.asDTO())
        })
        return listaParametros
    }

    private buildDTOObjetoPesonaje():DTOObjetoPesonaje[]{
        let listaParametros :DTOObjetoPesonaje[]= []
        this.objetos.forEach((parametro:ObjetoPesonaje)=>{
            listaParametros.push(parametro.asDTO())
        })
        return listaParametros
    }
}