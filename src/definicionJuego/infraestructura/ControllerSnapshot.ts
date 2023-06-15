import express, { NextFunction } from 'express';
import { ServicioSnapshot } from '../application/servicioSnapshot';
import { ServicioLog } from '../../commons/report/ServicioLog.js';
import { APIException } from '../../commons/APIException.js';
import { DTOSnapshotQueryParams } from '../domain/dto/DTOSnapshotQueryParams';
import { EventoSnapshot } from '../domain/EventoSnapshot';
import { FunctionType } from '../../commons/dependecy-container/Dependency';

export class ControllerSnapshot {

    private servicio: ServicioSnapshot;
    private router: express.Router;

    public constructor(servicio: ServicioSnapshot) {
        this.servicio = servicio;
        this.router = express.Router();
        this.router.get('/', (req: express.Request, res: express.Response, next:express.NextFunction) => VoidPromise(this.getSnapshot.bind(this),req,res,next))
    }

    public getRouter() {
        return this.router;
    }

    //Get 
    public async getSnapshot(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            this.logFunction(req.method, "Realizando obtencion snapshot" + req.path)
            let queryDTO: DTOSnapshotQueryParams = new DTOSnapshotQueryParams(req.query);
            let resultado: EventoSnapshot<unknown>[] = []
            resultado = await this.servicio.getSnapshotByTimestamp(queryDTO)
            if (resultado.length == 0) {
                throw new APIException(404, "GSS000", "No es posible hacer una snapshot porque no hay registros de eventos")
            }
            res.status(200).send(resultado);
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    }

    private exceptionHandler(req: express.Request, res: express.Response, err: any, next: express.NextFunction) {
        let codeHttpStatus: number = 500;
        if (err instanceof APIException) {
            codeHttpStatus = err.getStatus();
            res.status(codeHttpStatus).send(err.getMensajeYCodigo());
            this.logWarning(req.method, err.getMsgError(), err.getStatus.toString())
        } else {
            res.status(codeHttpStatus).send({ "ERR_CODE": "000000", "ERR_MESSAGE": "Ha ocurrido un error inesperado, por favor revise los logs de la aplicación: " + err.message });
            this.logError(req.method, "Ha ocurrido un error inesperado, por favor revise los logs de la aplicación " + err.message, res.statusCode.toString())
        }
    }

    private logFunction(tipoPeticion: string, mensaje: string, codigo?: string) {
        ServicioLog.getInstance().function(mensaje, tipoPeticion, codigo)
    }

    private logWarning(tipoPeticion: string, mensaje: string, codigo?: string) {
        ServicioLog.getInstance().warning(mensaje, tipoPeticion, codigo)
    }

    private logError(tipoPeticion: string, mensaje: string, codigo?: string) {
        ServicioLog.getInstance().error(mensaje, tipoPeticion, codigo)
    }

}

const VoidPromise = (fn: FunctionType<Promise<void>>, ...args:any) => {fn(...args).catch(error => {})};