import { LoggerInterface } from './LoggerInterface'

export class ServicioLog {

    private static instance: ServicioLog;

    private logger: LoggerInterface;

    private constructor(logger: LoggerInterface) {
        this.logger = logger;
    }

    public static initialize(logger: LoggerInterface) {
        if (ServicioLog.instance == null)
            ServicioLog.instance = new ServicioLog(logger)
        return ServicioLog.instance;
    }

    public static getInstance() {
        if (ServicioLog.instance == null)
            throw new Error("Not instanced.")
        return ServicioLog.instance;
    }

    public info(message: string): void { 
        this.logger.info(message);
    }
    public function(message: string,tipoPeticion:string,codigo?:string): void {
        this.logger.function(message,tipoPeticion,codigo);
    }
    public warning(message: string,tipoPeticion:string,codigo?:string): void {
        this.logger.warning(message,tipoPeticion,codigo);
    }
    public error(message: string,tipoPeticion:string,codigo?:string): void {
        this.logger.error(message,tipoPeticion,codigo);
    }

}