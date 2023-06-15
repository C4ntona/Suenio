import express from 'express';
import { BuilderDTOPersonaje } from './BuilderDTOPersonaje.js';
import { Personaje } from "../domain/Personaje.js";
import { ServicioPersonaje } from '../application/servicioPersonaje.js';
import { APIException } from "../../commons/APIException.js";
import { ServicioLog } from "../../commons/report/ServicioLog.js";
import { CircuitBreaker, CircuitBreakerState } from "./../domain/circuitBreaker/CircuitBreaker.js";
import { ErrorCircuitBreaker } from "./../../commons/ErrorCircuitBreaker.js";
import { FindAll } from '../domain/FindAll.js';
import { DTOFindAll } from '../domain/dto/DTOFindAll.js';
import { FunctionType } from '../../commons/dependecy-container/Dependency.js';

export class ControllerPersonaje {
    private servicio: ServicioPersonaje;
    private router: express.Router;
    private circuitBreaker: CircuitBreaker;

    public constructor(servicio: ServicioPersonaje) {
        this.servicio = servicio;
        this.router = express.Router();
        /**
        * @openapi 
        * /personaje:
        *  get:
        *     tags:
        *     - personaje
        *     summary: Devuelve todos los personaje 
        *     description: Petición que devuelve todos los personaje existentes
        *     responses:
        *       200:
        *         description: Te devuelve todos los personaje.
        *         content:
        *           application/json:
        *             schema:
        *               type: array
        *               items:
        *                   $ref: '#/components/schemas/DTOpersonaje'
        *       404:
         *        description: Te devuelve un error debido a que no existe ningún tipo test
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                  ERR_CODE:
         *                    type: string
         *                    description: Código de error
         *                    example: UTGT0000
         *                  ERR_MESSAGE:
         *                    type: string
         *                    description: Mensaje de error
         *                    example: No hay ningún registro de tipo test
        */ 
        this.router.get('/',(req: express.Request, res: express.Response, next:express.NextFunction) => VoidPromise(this.findAll.bind(this),req, res, next))
        /**
         * @openapi
         * /personaje/{identificador}:
         *   get:
         *     tags:
         *     - personaje
         *     summary: Devuelve el personaje indicado
         *     description: Petición que devuelve un personaje indicado por parametro, si este falla nos devolverá un error
         *     parameters:
         *       - in: path
         *         name: identificador
         *         required: true
         *         description: Identificador del personaje
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Devuelve un DTOpersonaje indicado por parameto.
         *         content:
         *           application/json:
         *             schema:
         *                $ref: '#/components/schemas/DTOpersonaje'               
         *       404:
         *         description: Te devuelve un error debido a que el personaje no existe
         *         content:
         *          application/json:
         *             schema:
         *               type: object
         *               properties:
         *                  ERR_CODE:
         *                     type: string
         *                     description: Código de error
         *                     example: TTGU0001
         *                  ERR_MESSAGE:
         *                     type: string
         *                     description: Mensaje de error
         *                     example: No existe el tipo de test indicado     
         */
        this.router.get('/:identificador', (req: express.Request, res: express.Response, next:express.NextFunction) => VoidPromise(this.findById.bind(this), req, res, next))
        /**
         * @openapi
         * /personaje:
         *   post:
         *     tags:
         *     - personaje
         *     summary: Añade un personaje
         *     description: Añade un personaje
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *               $ref: '#/components/schemas/DTOpersonaje'
         *     responses:
         *       200:
         *         description: Añade de forma satisfactoria un personaje
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/DTOpersonaje'
         *       400:
         *         description: Te devuelve un error debido a que el personaje ya es existente
         *         content:
         *          application/json:
         *             schema:
         *               type: object
         *               properties:
         *                  ERR_CODE:
         *                     type: string
         *                     description: Código de error
         *                     example: TTPA0001
         *                  ERR_MESSAGE:
         *                     type: string
         *                     description: Mensaje de error
         *                     example: Ya existe un tipo test con el código XXXXXXX
         *       422:
         *         description: Te devuelve un error debido a que el formato del personaje es incorrecto.
         *         content:
         *          application/json:
         *             schema:
         *               type: object
         *               properties:
         *                  ERR_CODE:
         *                     type: string
         *                     description: Código de error
         *                     example: XXX
         *                  ERR_MESSAGE:
         *                     type: string
         *                     description: Mensaje de error
         *                     example: Bad format.
         */ 
        this.router.post('/',(req: express.Request, res: express.Response, next:express.NextFunction) => VoidPromise( this.insert.bind(this),req, res, next))
        /**
         * @openapi
         * /personaje/{identificador}:
         *   put:
         *     tags:
         *     - personaje
         *     summary: Modifica un personaje
         *     description: Modifica un personaje, recibe un parametro que es el identificador del personaje y un body con los atributos a modificar
         *     parameters:
         *       - in: path
         *         name: identificador
         *         required: true
         *         description: Identificador personaje
         *         schema:
         *           type: string    
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *               $ref: '#/components/schemas/DTOpersonaje'
         *     responses:
         *       200:
         *         description: Añade de forma satisfactoria un personaje
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/DTOpersonaje'
         *       404:
         *         description: Te devuelve un error debido a que el personaje no existe
         *         content:
         *          application/json:
         *             schema:
         *               type: object
         *               properties:
         *                  ERR_CODE:
         *                     type: string
         *                     description: Código de error
         *                     example: TTA0001
         *                  ERR_MESSAGE:
         *                     type: string
         *                     description: Mensaje de error
         *                     example: No existe un tipo test con el código 1
         *       422:
         *         description: Te devuelve un error debido a que el formato del personaje es incorrecto.
         *         content:
         *          application/json:
         *             schema:
         *               type: object
         *               properties:
         *                  ERR_CODE:
         *                     type: string
         *                     description: Código de error
         *                     example: XXX
         *                  ERR_MESSAGE:
         *                     type: string
         *                     description: Mensaje de error
         *                     example: Bad format.
         */
        this.router.put('/:identificador', (req: express.Request, res: express.Response, next:express.NextFunction) => VoidPromise(this.update.bind(this),req, res, next))
        /**
         * @openapi
         * /personaje/{identificador}:
         *   delete:
         *     tags:
         *     - personaje
         *     summary: Elimina un personaje
         *     description: Permite eliminar los atributos de un personaje
         *     parameters:
         *       - in: path
         *         name: identificador
         *         required: true
         *         description: Identificador del personaje
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Elimina de forma satisfactoria un personaje
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/DTOpersonaje'
         *       404:
         *         description: Te devuelve un error debido a que el personaje no existe
         *         content:
         *          application/json:
         *             schema:
         *               type: object
         *               properties:
         *                  ERR_CODE:
         *                     type: string
         *                     description: Código de error
         *                     example: TTPM0001
         *                  ERR_MESSAGE:
         *                     type: string
         *                     description: Mensaje de error
         *                     example: No existe un tipo test con el código XXXXXXXX
         */
        this.router.delete('/:identificador',(req: express.Request, res: express.Response, next:express.NextFunction) => VoidPromise(this.delete.bind(this),req, res, next))


        this.router.get('/api/status', this.getStatus.bind(this))

        this.circuitBreaker = new CircuitBreaker(3)

    }

    public getRouter() {
        return this.router;
    }
    
    public async findAll(req: express.Request, res: express.Response, next:express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando peticion Personaje" + req.path)
            let listaFindAll: FindAll[] = await this.servicio.findAll();
            if (listaFindAll.length == 0) {
                throw new APIException(202, "PERG0000", "No hay ningún registro de personaje");
            }
            let listaDTOPersonaje: DTOFindAll[] = [];
            listaFindAll.forEach(idPersonaje => {
                listaDTOPersonaje.push(idPersonaje.asDTO())
            })
            this.circuitBreaker.correcto()
            res.status(200).send(listaDTOPersonaje);
            this.logFunction(req.method, "Se ha realizado la petición devolver todos Personajes correctamente", res.statusCode.toString())

        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    };
    // GET /personaje/:identificador
    public async findById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando peticion de un Personaje" + req.path)
            let objeto: Personaje | undefined = await this.servicio.find(req.params.identificador);
            if (objeto == undefined) {
                throw new APIException(404, "PEGT0000", "Not found.")
            }
            this.circuitBreaker.correcto()
            res.status(200).send(objeto.asDTO());
            this.logFunction(req.method, "Se ha realizado la petición devolver un Personaje correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    }
    // POST /personaje
    public async insert(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando una alta de Personaje" + req.path)
            let dto = BuilderDTOPersonaje.build(req.body);
            if (!dto.validar()) {
                throw new APIException(422, "XXX", "Bad format.");
            }
            let objeto = await this.servicio.insert(dto);
            this.circuitBreaker.correcto()
            res.status(200).send(objeto.asDTO());
            this.logFunction(req.method, "Se ha realizado la petición de alta Personaje correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err,next)
        }
    }
    // PUT /personaje/:identificador
    public async update(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando modificación de un Personaje" + req.path)
            let dto = BuilderDTOPersonaje.build(req.body);
            dto.id = req.params.identificador
            if (!dto.validar()) {
                throw new APIException(422, "XXX", "Bad format.");
            }
            let Personaje = await this.servicio.modify(dto);
            this.circuitBreaker.correcto()
            res.status(200).send(Personaje.asDTO());
            this.logFunction(req.method, "Se ha realizado la modificación del Personaje correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    };

    // Delete /personaje/:identificador
    public async delete(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando una baja de Personaje" + req.path)
            const identificador = req.params.identificador;
            let personaje = await this.servicio.delete(identificador);
            this.circuitBreaker.correcto()
            res.status(200).send(personaje.asDTO());
            this.logFunction(req.method, "Se ha eliminado el Personaje correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    }
    //Get /status del servidor
    public getStatus(req: express.Request, res: express.Response) {
        switch (this.circuitBreaker.getEstado()) {
            case CircuitBreakerState.CLOSED: {
                res.status(200).json({ mensaje: "El servidor está correctamente: Personaje" });
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
                next(new ErrorCircuitBreaker("CBTT", "Ha saltado el CircuitBreaker en personaje"))
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

const VoidPromise = (fn: FunctionType<Promise<void>>, ...args:any) => {fn(...args).catch(error => {})};