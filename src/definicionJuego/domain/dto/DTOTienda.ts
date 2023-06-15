export class DTOTienda {
    public id: string;
    public identificador: string;
    public nombre: string;
    public precio: number;
    public descripcion: string;

  /**
  * @openapi
  * components:
  *   schemas:
  *     DTOTienda:
  *       type: object
  *       properties:
  *         identificador:
  *           type: string
  *           description: Identificador del articulo.
  *           example: "MuñecoInchable"
  *         nombre:
  *           type: string
  *           description: Nombre del articulo.
  *           example: "Rogal Dorn"
  *         precio:
  *           type: number
  *           description: Precio del articulo.
  *           example: 12
  *         descripcion:
  *           type: string
  *           description: Descripción del articulo
  *           example: "Figura de 120mm de Rogal Dorn primarca de los puños del emperador"
  */

   public constructor(identificador:string,nombre:string,precio:number,descripcion:string) {
    let id = new Date();
    this.id = JSON.stringify(id.getTime());
    this.identificador = identificador;
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
}

  public validar(): boolean {
    return (
      typeof this.identificador === 'string' &&
      typeof this.nombre === 'string' &&
      typeof this.precio === 'number' &&
      typeof this.descripcion === 'string' 
    );
  }

}