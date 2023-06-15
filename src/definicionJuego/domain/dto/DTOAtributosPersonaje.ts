export class DTOAtributoPersonaje {

    public fuerza: number;
    public agilidad : number;
    public constitucion: number;
    public inteligencia: number;
    public sabiduria: number;
    public carisma: number;
    
    /**
    * @openapi
    * components:
    *   schemas:
    *     DTOparametrosVersionOperaApi:
    *       type: object
    *       properties:
    *         identificador:
    *           type: string
    *           description: Identificador de la OperacionApi DTO     
    *           example: 1
    *         nombre:
    *           type: string
    *           description: Nombre de la OperacionApi DTO     
    *           example: OperacionApi
    *         method:
    *           type: string
    *           description: Petición de la OperacionApi DTO     
    *           example: POST
    *         auth:
    *           type: string
    *           description: Autentificacion DTO     
    *           example: auth
    *         ruta:
    *           type: string
    *           description: Nombre de la ruta de la OperacionApi DTO     
    *           example: OperacionApi
    *         parametros:
    *           type: string
    *           description: Parametros de la OperacionApi DTO     
    *           example: [{"nombre":"nombre","contentType":"string","tipo":"body","obligatorio":false}]
    */
    public constructor(fuerza:number,agilidad:number,constitucion:number,inteligencia:number,sabiduria:number,carisma:number) {
        this.fuerza = fuerza;
        this.agilidad = agilidad;
        this.constitucion = constitucion;
        this.inteligencia = inteligencia;
        this.sabiduria = sabiduria;
        this.carisma = carisma;
    }

    public validar(): boolean {
        return (
            typeof this.fuerza === 'number' &&
            typeof this.agilidad === 'number' &&
            typeof this.constitucion === 'number' &&
            typeof this.inteligencia === 'number' &&
            typeof this.sabiduria === 'number' &&
            typeof this.carisma === 'number'
        )
    }
}