import express from 'express';
import { ServicioLogger } from "./../application/servicioLogger.js";
import { DTOLoggerQueryParams } from "../domain/dto/DTOLoggerQueryParams.js";
import { Logger } from '../../commons/report/Logger.js';
export class ControllerLogger {

    private servicio: ServicioLogger;
    private router: express.Router;

    public constructor(servicio: ServicioLogger) {
        this.servicio = servicio;
        this.router = express.Router();
        this.router.get('/', this.findFilter.bind(this))
    }

    //Get /logger con filtrado y si no filtra saca todos los logs
    public findFilter(req: express.Request, res: express.Response) {
        try {
            //Creo el objeto DTO con los queryParams
            let loggerDTO: DTOLoggerQueryParams = new DTOLoggerQueryParams(req.query);
            let listaLoggerFiltrado: Logger[] = this.servicio.findFilter(loggerDTO)

            res.status(200).send(listaLoggerFiltrado);

        } catch {
            res.status(500).json({ error: 'No se pudo cargar el archivo de registro.' });
        }
    }

    public getRouter() {
        return this.router;
    }

}