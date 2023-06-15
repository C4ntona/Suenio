export class DTOPartida {
    //TODO acuerdate de no meter los personajes por aquí
    public id: string;
    public identificador: string;
    public nombre: string;
    public master: string;
    public historial: string;
    public personajes: string[]=[];

  /**
  * @openapi
  * components:
  *   schemas:
  *     DTOPartida:
  *       type: object
  *       properties:
  *         identificador:
  *           type: string
  *           description: Identificador de la partida.
  *           example: "ImAAlfaMaleGaming@gmail.com"
  *         nombre:
  *           type: string
  *           description: Nombre de la partida.
  *           example: "Campaña de las puertas de Baldur"
  *         master:
  *           type: string
  *           description: Creador y master de la partida.
  *           example: "Fernandeath"
  *         historial:
  *           type: string
  *           description: Historial de la partida
  *           example: "Jugador 1 lanzo una pierda, jugador 1 hirió a Gnoll Duro"
  *         personajes:
  *           type: array
  *           items: string
  *           description: Identificadores de los personajes o jugadores en la partida partida.
  *           example: ["DaniRojas","DemonSlayer"]
  */

   public constructor(identificador:string,nombre:string,master:string,historial:string,personajes:string[]) {
    let id = new Date();
    this.id = JSON.stringify(id.getTime());
    this.identificador = identificador;
    this.nombre = nombre;
    this.master = master;
    this.historial = historial;
    this.personajes = personajes;
}

  public validar(): boolean {
    return (
      typeof this.identificador === 'string' &&
      typeof this.nombre === 'string' &&
      typeof this.master === 'string' &&
      typeof this.historial === 'string' 
    );
  }

}