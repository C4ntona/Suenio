import { DTOPersonaje } from "./DTOPersonaje";

export class DTOUsuario {
    //TODO acuerdate de no meter los personajes por aquí
    public id: string;
    public identificador: string;
    public nombre: string;
    public password: string;
    public email: string;
    public personajes: string[]=[];

  /**
  * @openapi
  * components:
  *   schemas:
  *     DTOUsuario:
  *       type: object
  *       properties:
  *         identificador:
  *           type: string
  *           description: Identificador del usuario.
  *           example: "SergioStars@yahoo.com"
  *         nombre:
  *           type: string
  *           description: Nombre del usuario
  *           example: Estrella
  *         password:
  *           type: string
  *           description: Contrseña del usuario
  *           example: L0sH3rm4n0sP010
  *         email:
  *           type: string
  *           description: Correo electronico del usuario
  *           example: "SergioStars@yahoo.com"
  *         personajes:
  *           type: string
  *           description: Un array que contiene los distintos identificadores de sus personajes
  *           example: ["1241sdaw4112","3454asda2321"]
  */
   // TODO: Revisar IDs

   public constructor(identificador:string,nombre:string,password:string,email:string,personajes:string[]) {
    let id = new Date();
    this.id = JSON.stringify(id.getTime());
    this.identificador = identificador;
    this.nombre = nombre;
    this.password = password;
    this.email = email;
    this.personajes = personajes;
}

  public validar(): boolean {
    return (
      typeof this.identificador === 'string' &&
      typeof this.nombre === 'string' &&
      typeof this.password === 'string' &&
      typeof this.email === 'string' 
    );
  }

}