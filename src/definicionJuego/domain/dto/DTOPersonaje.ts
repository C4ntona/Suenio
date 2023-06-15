import { DTOAtributoPersonaje } from "./DTOAtributosPersonaje";
import { DTOHabilidadPersonaje } from "./DTOHabilidadPersonaje";
import { DTOHechizoPersonaje } from "./DTOHechizosPersonaje";
import { DTOEquipoPersonaje } from "./DTOEquipoPersonaje";
import { DTOObjetoPesonaje } from "./DTOObjetoPersonaje";

export class DTOPersonaje {
  // TODO: Revisar IDs
    public id: string;
    public clase : string;
    public nombre: string;
    public raza: string;
    public nivel: number;
    public alineamiento: string;
    public experiencia: number;
    public trasfondo:string;
    public rasgos:string;
    public salud: number;
    public atributos: DTOAtributoPersonaje []=[];
    public habilidades: DTOHabilidadPersonaje []=[]
    public hechizos: DTOHechizoPersonaje []=[];
    public equipo: DTOEquipoPersonaje []=[];
    public objetos: DTOObjetoPesonaje []=[];

  /**
  * @personaje
  * components:
  *   schemas:
  *     PostOperacionApiEntrada:
  *       type: object
  *       properties:
  *         identificador:
  *           type: string
  *           description: Identificador de la OperacionApi DTO entrada
  *           example: 1
  *         nombre:
  *           type: string
  *           description: Nombre de la OperacionApi DTO entrada
  *           example: OperacionApi
  *         method:
  *           type: string
  *           description: Petición de la OperacionApi DTO entrada
  *           example: POST
  *         auth:
  *           type: string
  *           description: Autentificacion DTO entrada
  *           example: auth
  *         ruta:
  *           type: string
  *           description: Nombre de la ruta de la OperacionApi DTO entrada
  *           example: OperacionApi
  *         parametros:
  *           type: string
  *           description: Parametros de la OperacionApi DTO entrada
  *           example: [{"nombre":"nombre","contentType":"string","tipo":"body","obligatorio":false}]
  */
  public constructor(identificador:string,clase:string,nombre:string,raza:string,nivel:number,alineamiento:string,experiencia:number,trasfondo:string,rasgos:string,salud:number,
    atributos:DTOAtributoPersonaje[],
    habilidades:DTOHabilidadPersonaje[],
    hechizos:DTOHechizoPersonaje[],
    equipo:DTOEquipoPersonaje[],
    objetos:DTOObjetoPesonaje[]) {
    this.id = (identificador+nombre);
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
  };

  public validar(): boolean {
    return ( 
      typeof this.id === 'string' &&
      typeof this.clase === 'string' &&
      typeof this.nombre === 'string' &&
      typeof this.raza === 'string' &&
      typeof this.nivel === 'number' &&
      typeof this.alineamiento === 'string' &&
      typeof this.experiencia === 'number' &&
      typeof this.trasfondo === 'string' &&
      typeof this.rasgos === 'string' &&
      typeof this.salud === 'number' &&
      this.validarDTOAtributos()
    );
  }

  private validarDTOAtributos(): boolean {
    for (const parametro of this.atributos) {
      const valido = parametro.validar();
      if (!valido)
        return false
    }
    for (const parametro of this.habilidades) {
      const valido = parametro.validar();
      if (!valido)
        return false
    }
    for (const parametro of this.hechizos) {
      const valido = parametro.validar();
      if (!valido)
        return false
    }
    for (const parametro of this.objetos) {
      const valido = parametro.validar();
      if (!valido)
        return false
    }
    for (const parametro of this.equipo) {
      const valido = parametro.validar();
      if (!valido)
        return false
    }
    return true
  }

}