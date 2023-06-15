export class DTOObjetoPesonaje {

    public nombreObjeto: string;
    
    /**
    * @openapi
    * components:
    *   schemas:
    *     DTOparametrosVersionOperaApi:
    *       type: object
    *       properties:
    *         identificador:
    *           type: string
    *           description: Identificador de la OperacionApi DTO     *           example: 1
    *         nombre:
    *           type: string
    *           description: Nombre de la OperacionApi DTO     *           example: OperacionApi
    *         method:
    *           type: string
    *           description: Petición de la OperacionApi DTO     *           example: POST
    *         auth:
    *           type: string
    *           description: Autentificacion DTO     *           example: auth
    *         ruta:
    *           type: string
    *           description: Nombre de la ruta de la OperacionApi DTO     *           example: OperacionApi
    *         parametros:
    *           type: string
    *           description: Parametros de la OperacionApi DTO     *           example: [{"nombre":"nombre","contentType":"string","tipo":"body","obligatorio":false}]
    */
    
    public constructor(nombreObjeto: string) {
        this.nombreObjeto = nombreObjeto;
    }

    public validar(): boolean {
        return (
            typeof this.nombreObjeto === 'string'
        )
    }
}