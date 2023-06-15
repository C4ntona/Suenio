export class Configuration{

    private static instance: Configuration

    private args: Map<string, string>; 
    private sessionId:string
    private puerto : number 
    private host : string
    private logger : string
    private  limiteRequestBody : string


    private constructor(puerto:number, host:string, logger:string,limiteRequestBody:string, args: Map<string, string> ) {
        this.sessionId = Date.now().toString()
        this.puerto = puerto
        this.host = host
        this.logger = logger
        this.limiteRequestBody = limiteRequestBody
        this.args = args
    }

    public static getInstance(): Configuration{
        if(Configuration.instance == undefined){
            throw new Error("No se ha inicializado el repositorio en arranque");
        }
        return Configuration.instance;
    }

    public static initialice(args :Map<string, string>):Configuration{
        if(Configuration.instance != undefined){
            throw new Error("Se ha intentado inicializar el repositorio fuera del arranque");
        }
        //Si no consigue el valor por la variable ponemos por predeterminado a continuacion de || 
        const argsParametro = args
        const puerto = args.get('PORT') || '3001'; 
        const host = args.get('HOST') || 'localhost'; 
        const logger = args.get('LOGGER') || 'LoggerFichero';
        const limiteRequestBody= args.get('LIMITE_REQUEST_BODY') || '5';

        Configuration.instance = new Configuration(parseInt(puerto),host,logger,limiteRequestBody,argsParametro);
        return Configuration.instance;
    }

    public getSession(){
        return this.sessionId
    }

    public getPuerto(){
        return this.puerto
    }

    public getHost(){
        return this.host
    }

    public getLogger(){
        return this.logger
    }
    public getArgs(){
        return this.args
    }

    public getLimiteRequestBody(){
        return this.limiteRequestBody
    }

    public getArg(key: string): string {
        return this.args.get(key) || "";
      }
}