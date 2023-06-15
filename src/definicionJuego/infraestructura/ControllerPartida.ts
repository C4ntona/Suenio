import express from 'express';
import { BuilderDTOPartida } from './BuilderDTOPartida.js';
import { Partida } from "../domain/Partida.js";
import { ServicioPartida } from '../application/servicioPartida.js';
import { APIException } from "../../commons/APIException.js";
import { ServicioLog } from "../../commons/report/ServicioLog.js";
import { CircuitBreaker, CircuitBreakerState } from "./../domain/circuitBreaker/CircuitBreaker.js";
import { ErrorCircuitBreaker } from "./../../commons/ErrorCircuitBreaker.js";
import { FindAll } from '../domain/FindAll.js';
import { DTOFindAll } from '../domain/dto/DTOFindAll.js';


export class ControllerPartida {
    private servicio: ServicioPartida;
    private router: express.Router;
    private circuitBreaker: CircuitBreaker;

    public constructor(servicio: ServicioPartida) {
        this.servicio = servicio;
        this.router = express.Router();
        /**
        * @openapi
        * /Partida:
        *   get:
        *     tags:
        *     - Partida
        *     summary: Devuelve todas las partidas
        *     description: Petición que devuelve todos las partidas existentes.
        *     responses:
        *       200:
        *         description:  Devuelve un DTO de Partida.
        *         content:
        *           application/json:
        *             schema:
        *               type: array
        *               items:
        *                 $ref: '#/components/schemas/DTOPartida'
        *       204:
        *         description: No hay ninguna OperacionesApi
        */
        this.router.get('/', this.findAll.bind(this))
        /**
        * @openapi
        * /Partida/{identificador}:
        *   get:
        *     tags:
        *     - Partida
        *     summary: Devuelve todos las partidas
        *     description: Petición que devuelve todos las partidas existentes y que esten activas
        *     parameters:
        *       - in: path
        *         name: identificador
        *         required: true
        *         description: Identificador Partida
        *         schema:
        *           type: string           
        *     responses:
        *       200:
        *         description:  Petición que devuelve una de las partidas que se indique por parametro existentes y que esten activas
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOPartida'
        *       404:
        *          description: Devuelve un error debido a que la Partida no existe
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: BUTG0001
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: No se ha encontrado la operación con código 1      
        */
        this.router.get('/:identificador', this.findById.bind(this))
        /**
        * @openapi
        * /Partida:
        *   post:
        *     tags:
        *     - Partida
        *     summary: Añade una Partida
        *     description: Petición que añade una Partida, entrará un DTO PostPartidaEntrada y saldrá otro de GetPartidaSalida
        *     requestBody:
        *       required: true
        *       content:
        *           application/json:
        *               schema:
        *                    $ref: '#/components/schemas/DTOPartida'
        *     responses:
        *       200:
        *         description:  Petición que añade la Partida y devuelve su JSON, si estuviese desactivada su versión la da de alta de nuevo
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOPartida'
        *       409:
        *          description: Devuelve un error debido a que la Partida ya existe
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: APP0001
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: Ya existe una operación API con el código       
        */
        this.router.post('/', this.insert.bind(this))
        /**
        * @openapi
        * /Partida/{identificador}:
        *   put:
        *     tags:
        *     - Partida
        *     summary: Modifica una Partida
        *     description: Petición que modifica una Partida, entrará un DTO PostPartidaEntrada y saldrá otro de GetPartidaSalida
        *     parameters:
        *       - in: path
        *         name: identificador
        *         required: true
        *         description: Identificador Partida
        *         schema:
        *           type: string   
        *     requestBody:
        *       required: true
        *       content:
        *           application/json:
        *               schema:
        *                    $ref: '#/components/schemas/DTOPartida'
        *     responses:
        *       200:
        *         description:  Petición que devuelve una de las partidas modificada por los campos del body y se generará una nueva versión de Partida
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOPartida'
        *       404:
        *          description: Devuelve un error debido a que la Partida no existe o esta desactivada su version
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: APG0001
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: No se ha encontrado la operación con código 1
        */
        this.router.put('/:identificador', this.update.bind(this))
        /**
        * @openapi
        * /Partida/{identificador}:
        *   delete:
        *     tags:
        *     - Partida
        *     summary: Elimina una Partida
        *     description: Petición que elimina una Partida, entrará su identificador por parametro y saldrá un DTO de GetPartidaSalida para confirmar que se ha eliminado
        *     parameters:
        *       - in: path
        *         name: identificador
        *         required: true
        *         description: Identificador Partida
        *         schema:
        *           type: string   
        *     responses:
        *       200:
        *         description:  Petición que elimina una de las partidas y se generará una nueva versión de Partida desactivada
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOPartida'
        *       400:
        *          description: Devuelve un error debido a que la Partida no existe o esta desactivada su version
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: APD0001
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: No se ha encontrado la operación de API que se quería eliminar     
        */
        this.router.delete('/:identificador', this.delete.bind(this))

        this.router.get('/api/status', this.getStatus.bind(this))

        this.circuitBreaker = new CircuitBreaker(3)

    }

    public getRouter() {
        return this.router;
    }
    
    public async findAll(req: express.Request, res: express.Response, next:express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando peticion Partida" + req.path)
            let listaFindAll: FindAll[] = await this.servicio.findAll();
            let listaDTOPartida: DTOFindAll[] = [];
            listaFindAll.forEach(idPartida => {
                listaDTOPartida.push(idPartida.asDTO())
            })
            this.circuitBreaker.correcto()
            res.status(200).send(listaDTOPartida);
            this.logFunction(req.method, "Se ha realizado la petición devolver todas Partidas correctamente", res.statusCode.toString())

        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    };

    // GET /partida/:identificador
    public async findById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando peticion a una Partida" + req.path)
            let objeto: Partida | undefined = await this.servicio.find(req.params.identificador);
            if (objeto == undefined) {
                throw new APIException(404, "PAGT0000", "Not found.")
            }
            this.circuitBreaker.correcto()
            res.status(200).send(objeto.asDTO());
            this.logFunction(req.method, "Se ha realizado la petición devolver un Partida correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    }
    // POST /partida
    public async insert(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando una alta de Partida" + req.path)
            let dto = BuilderDTOPartida.build(req.body);
            if (!dto.validar()) {
                throw new APIException(422, "XXX", "Bad format.");
            }
            let objeto = await this.servicio.insert(dto);
            this.circuitBreaker.correcto()
            res.status(200).send(objeto.asDTO());
            this.logFunction(req.method, "Se ha realizado la petición de alta Partida correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err,next)
        }
    }

    // PUT /partida/:identificador
    public async update(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando modificación a una Partida" + req.path)
            let dto = BuilderDTOPartida.build(req.body);
            dto.id = req.params.identificador
            if (!dto.validar()) {
                throw new APIException(422, "XXX", "Bad format.");
            }
            let Partida = await this.servicio.modify(dto);
            this.circuitBreaker.correcto()
            res.status(200).send(Partida.asDTO());
            this.logFunction(req.method, "Se ha realizado la modificación de la Partida correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    };

    // Delete /partida/:identificador
    public async delete(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando una baja de Partida" + req.path)
            const identificador = req.params.identificador;
            let Partida = await this.servicio.delete(identificador);
            this.circuitBreaker.correcto()
            res.status(200).send(Partida.asDTO());
            this.logFunction(req.method, "Se ha eliminado la Partida correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    }

    //Get /status del servidor
    public getStatus(req: express.Request, res: express.Response) {
        switch (this.circuitBreaker.getEstado()) {
            case CircuitBreakerState.CLOSED: {
                res.status(200).json({ mensaje: "El servidor está correctamente: Partida" });
                break;
            }
            case CircuitBreakerState.HALF_OPEN: {
                res.status(400).json({ mensaje: "Ha habido un error en la peticion" })
                break;
            }
            case CircuitBreakerState.OPEN: {
                res.status(500).json({ mensaje: "Ha saltado el CircuitBreaker, espere por favor a que se vuelva a reiniciar el sistema" })
                break;
            }
        }
    }

    private exceptionHandler(req: express.Request, res: express.Response, err: any, next: express.NextFunction) {
        let codeHttpStatus: number = 500;
        if (err instanceof APIException) {
            codeHttpStatus = err.getStatus();
            res.status(codeHttpStatus).send(err.getMensajeYCodigo());
            this.logWarning(req.method, err.getMsgError(), err.getStatus.toString())
        } else {
            this.circuitBreaker.evaluarPeticion()
            if (this.circuitBreaker.getEstado() == CircuitBreakerState.OPEN) {
                next(new ErrorCircuitBreaker("CBTT", "Ha saltado el CircuitBreaker en Partida"))
            }
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