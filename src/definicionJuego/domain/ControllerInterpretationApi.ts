// import express from 'express';
// import { APIException } from '../../commons/APIException.js';
// import { ServicioLog } from '../../commons/report/ServicioLog.js';
// import { CircuitBreaker, CircuitBreakerState } from "../domain/circuitBreaker/CircuitBreaker.js";
// import { ErrorCircuitBreaker } from "../../commons/ErrorCircuitBreaker.js";
// import { FunctionType } from '../../commons/dependecy-container/Dependency.js';
// import { ServicioInterpretacionApi } from '../application/servicioInterpretacionApi.js';
// import { OperacionApi } from '../domain/OperacionApi.js';


// export class ControllerInterpretacionApi {

//     private servicio: ServicioInterpretacionApi;
//     private router: express.Router;
//     private circuitBreaker: CircuitBreaker;

//     public constructor(servicio: ServicioInterpretacionApi) {
//         this.servicio = servicio;
//         this.router = express.Router();
//         this.router.post('/',(req: express.Request, res: express.Response, next:express.NextFunction) => VoidPromise( this.insert.bind(this),req, res, next))
//         this.circuitBreaker = new CircuitBreaker(3)
//     }

//     public getRouter() {
//         return this.router;
//     }

//     //POST
//     public async insert(req: express.Request, res: express.Response, next: express.NextFunction) {
//         try {
//             this.logFunction(req.method, "interpretando api " + req.path)
//             let operacionesApi:OperacionApi[] = await this.servicio.interpretarApi(req.body);
//             this.circuitBreaker.correcto()
//             res.status(200).send(operacionesApi);
//             this.logFunction(req.method, "Interpretado correctamente la api", res.statusCode.toString())
//         } catch (err: any) {
//             this.exceptionHandler(req, res, err, next)
//         }
//     }

//     private exceptionHandler(req: express.Request, res: express.Response, err: any, next: express.NextFunction) {
//         let codeHttpStatus: number = 500;
//         if (err instanceof APIException) {
//             codeHttpStatus = err.getStatus();
//             res.status(codeHttpStatus).send(err.getMensajeYCodigo());
//             this.logWarning(req.method, err.getMsgError(), err.getStatus.toString())
//         } else {
//             this.circuitBreaker.evaluarPeticion()
//             if (this.circuitBreaker.getEstado() == CircuitBreakerState.OPEN) {
//                 next(new ErrorCircuitBreaker("CBTT", "Ha saltado el CircuitBreaker en TipoTest"))
//             }
//             res.status(codeHttpStatus).send({ "ERR_CODE": "000000", "ERR_MESSAGE": "Ha ocurrido un error inesperado, por favor revise los logs de la aplicación: " + err.message });
//             this.logError(req.method, "Ha ocurrido un error inesperado, por favor revise los logs de la aplicación " + err.message, res.statusCode.toString())
//         }
//     }

//     //GET /status del servidor
//     public getStatus(req: express.Request, res: express.Response) {
//         switch (this.circuitBreaker.getEstado()) {
//             case CircuitBreakerState.CLOSED: {
//                 res.status(200).json({ mensaje: "El servidor está correctamente :InterpretarApi" });
//                 break;
//             }
//             case CircuitBreakerState.HALF_OPEN: {
//                 res.status(400).json({ mensaje: "Ha habido un error en la peticion" })
//                 break;
//             }
//             case CircuitBreakerState.OPEN: {
//                 res.status(500).json({ mensaje: "Ha saltado el CircuitBreaker, espere por favor a que se vuelva a reiniciar el sistema" })
//                 break;
//             }
//         }
//     }

//     private logFunction(tipoPeticion: string, mensaje: string, codigo?: string) {
//         ServicioLog.getInstance().function(mensaje, tipoPeticion, codigo)
//     }

//     private logWarning(tipoPeticion: string, mensaje: string, codigo?: string) {
//         ServicioLog.getInstance().warning(mensaje, tipoPeticion, codigo)
//     }

//     private logError(tipoPeticion: string, mensaje: string, codigo?: string) {
//         ServicioLog.getInstance().error(mensaje, tipoPeticion, codigo)
//     }

// }

// const VoidPromise = (fn: FunctionType<Promise<void>>, ...args:any) => {fn(...args).catch(error => {})};