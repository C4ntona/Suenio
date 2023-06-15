import { LoggerInterface } from "./LoggerInterface";
import { Logger } from "../report/Logger";
import { DTOLogger } from "../../definicionJuego/domain/dto/DTOLogger";
import * as fs from 'fs';

export class LoggerFichero implements LoggerInterface {
    
    private listaFichero :Logger [];
    public static readonly NAME = "LoggerFichero";
    public constructor(args : Map<string,string>) {
        this.listaFichero = [];
    }
    getName(): string {
       return LoggerFichero.NAME
    }

    // TODO: Revisión borrado de parametro
    public info(mensaje: string, tipoPeticion?: string | undefined, codigo?: string | undefined): void {
        let objLogger = new Logger("[INFO]",mensaje);
        this.listaFichero.push(objLogger);
        this.crearFichero(this.listaFichero)
    }
    public function(mensaje: string, tipoPeticion?: string | undefined, codigo?: string | undefined): void {
        let objLogger = new Logger("[FUNCTION]",mensaje,tipoPeticion,codigo);
        this.listaFichero.push(objLogger);
        this.crearFichero(this.listaFichero)
    }
    public warning(mensaje: string, tipoPeticion?: string | undefined, codigo?: string | undefined): void {
        let objLogger = new Logger("[WARNING]",mensaje,tipoPeticion,codigo);
        this.listaFichero.push(objLogger);
        this.crearFichero(this.listaFichero)
    }
    public error(mensaje: string, tipoPeticion?: string | undefined, codigo?: string | undefined): void {
        let objLogger = new Logger("[ERROR]",mensaje,tipoPeticion,codigo);
        this.listaFichero.push(objLogger);
        this.crearFichero(this.listaFichero)
    }
    
    private crearFichero(lista: Logger[]): void {
        fs.writeFileSync("./resources/logger.json", JSON.stringify(lista));
    }
    
    private leerFichero(): Logger[] {
        let listaLogs: Logger[] = []
        if (fs.existsSync("./resources/logger.json")) {
            const contenidoArchivo = fs.readFileSync("./resources/logger.json", "utf-8").trim()
            if(contenidoArchivo && contenidoArchivo != "")
                JSON.parse(contenidoArchivo).forEach((dto: DTOLogger) => {
                    const objetoLog = new Logger(dto.tipoLog, dto.mensaje, dto.tipoPeticion, dto.codigoPeticion, dto.timeStamp)
                    listaLogs.push(objetoLog)
                });
        }
        return listaLogs
    }

    onExit(): boolean {
        return true 
    }

}