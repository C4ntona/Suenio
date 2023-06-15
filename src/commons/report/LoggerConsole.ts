import { LoggerInterface } from "./LoggerInterface";
import { Logger } from "../report/Logger";
import colors from 'colors';
export class LoggerConsole implements LoggerInterface {
    public static readonly NAME = "LoggerConsole";
    public constructor(args : Map<string,string>) {
        //
    }
    getName(): string {
       return  LoggerConsole.NAME
    }
    
    public info(mensaje: string, tipoPeticion?: string | undefined, codigo?: string | undefined): void {
        let objLogger = new Logger("[INFO]",mensaje);
        console.info(objLogger.toString())

    }
    public function(mensaje: string, tipoPeticion?: string | undefined, codigo?: string | undefined): void {
        let objLogger = new Logger("[FUNCTION]",mensaje,tipoPeticion,codigo);
        console.log(colors.green(objLogger.toString()))
    }
    public warning(mensaje: string, tipoPeticion?: string | undefined, codigo?: string | undefined): void {
        let objLogger = new Logger("[WARNING]",mensaje,tipoPeticion,codigo);
        console.info(colors.yellow(objLogger.toString()))
    }
    public error(mensaje: string, tipoPeticion?: string | undefined, codigo?: string | undefined): void {
        let objLogger = new Logger("[ERROR]",mensaje,tipoPeticion,codigo);
        console.info(colors.red(objLogger.toString()))
    }

    public onExit(): boolean {
        return true;
    }

}