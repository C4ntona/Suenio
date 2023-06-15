import * as fs from 'fs';
import { Logger } from "../../commons/report/Logger";
import { DTOLoggerQueryParams } from '../domain/dto/DTOLoggerQueryParams';
import { DTOLogger } from "../domain/dto/DTOLogger";

export class RepositoryLoggerImplFicheros {

    public findFilter(loggerDTO: DTOLoggerQueryParams): Logger[] {
        let listaLogs: Logger[] = this.leerFichero()
        return listaLogs.filter(log => !loggerDTO.tipoLog || log.getTipoLog() == loggerDTO.tipoLog)
            .filter(log => !loggerDTO.fechaInicio || log.getTimestamp() >= loggerDTO.fechaInicio)
            .filter(log => !loggerDTO.fechaFin || log.getTimestamp() <= loggerDTO.fechaFin)
            .filter(log => !loggerDTO.tipoPeticion || log.getTipoPeticion() == loggerDTO.tipoPeticion)
            .filter(log => !loggerDTO.codigoPeticion || log.getCodigoPeticion() == loggerDTO.codigoPeticion);
    }

    private leerFichero(): Logger[] {
        let listaLogs: Logger[] = []
        if (fs.existsSync("./resources/logger.json")) {
            const contenidoArchivo = fs.readFileSync("./resources/logger.json", "utf-8").trim()
            if (contenidoArchivo && contenidoArchivo != "")
                JSON.parse(contenidoArchivo).forEach((dto: DTOLogger) => {
                    const objetoLog = new Logger(dto.tipoLog, dto.mensaje, dto.tipoPeticion, dto.codigoPeticion, dto.timeStamp)
                    listaLogs.push(objetoLog)
                });
        }
        return listaLogs
    }
}