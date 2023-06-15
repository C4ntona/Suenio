import express from 'express';
import { BuilderDTOTienda } from './BuilderDTOTienda.js';
import { Tienda } from "../domain/Tienda.js";
import { ServicioTienda } from '../application/servicioTienda.js';
import { APIException } from "../../commons/APIException.js";
import { ServicioLog } from "../../commons/report/ServicioLog.js";
import { CircuitBreaker, CircuitBreakerState } from "./../domain/circuitBreaker/CircuitBreaker.js";
import { ErrorCircuitBreaker } from "./../../commons/ErrorCircuitBreaker.js";
import { FindAll } from '../domain/FindAll.js';
import { DTOFindAll } from '../domain/dto/DTOFindAll.js';


export class ControllerTienda {
    private servicio: ServicioTienda;
    private router: express.Router;
    private circuitBreaker: CircuitBreaker;

    public constructor(servicio: ServicioTienda) {
        this.servicio = servicio;
        this.router = express.Router();
        /**
        * @openapi
        * /Tienda:
        *   get:
        *     tags:
        *     - Tienda
        *     summary: Devuelve todos los ariticulos
        *     description: Petición que devuelve todos los ariticulos existentes.
        *     responses:
        *       200:
        *         description: Devuelve un DTO de todas las Tienda.
        *         content:
        *           application/json:
        *             schema:
        *               type: array
        *               items:
        *                 $ref: '#/components/schemas/DTOTienda'
        *       204:
        *         description: No hay ninguna articulo
        */
        this.router.get('/', this.findAll.bind(this))
        /**
        * @openapi
        * /Tienda/{identificador}:
        *   get:
        *     tags:
        *     - Tienda
        *     summary: Devuelve uno de los ariticulos
        *     description: Petición que devuelve el ariticulo seleccionado por parametro.
        *     parameters:
        *       - in: path
        *         name: identificador
        *         required: true
        *         description: Identificador Tienda
        *         schema:
        *           type: string           
        *     responses:
        *       200:
        *         description:  Petición que devuelve uno de los ariticulos que se indique por parametro existentes.
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOTienda'
        *       404:
        *          description: Devuelve un error debido a que el articulo no existe
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: TIG0001
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: No se ha encontrado el articulo con código 1      
        */
        this.router.get('/:identificador', this.findById.bind(this))
        /**
        * @openapi
        * /Tienda:
        *   post:
        *     tags:
        *     - Tienda
        *     summary: Añade un articulo
        *     description: Petición que añade un articulo, mediante los atributos indicados en el json
        *     requestBody:
        *       required: true
        *       content:
        *           application/json:
        *               schema:
        *                    $ref: '#/components/schemas/DTOTienda'
        *     responses:
        *       200:
        *         description:  Petición que añade el articulo y devuelve su JSON.
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOTienda'
        *       409:
        *          description: Devuelve un error debido a que el articulo ya existe
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: TIP0001
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: Ya existe un articulo con el código
        *       422:
        *          description: Devuelve un error debido a que el formato es incorrecto
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: XXXXXX
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: Bad Format            
        */
        this.router.post('/', this.insert.bind(this))
        /**
        * @openapi
        * /Tienda/{identificador}:
        *   put:
        *     tags:
        *     - Tienda
        *     summary: Modifica un articulo
        *     description: Petición que modifica un articulo, con el parametro indicado y mediante los atributos especificados en el json
        *     parameters:
        *       - in: path
        *         name: identificador
        *         required: true
        *         description: Identificador Tienda
        *         schema:
        *           type: string   
        *     requestBody:
        *       required: true
        *       content:
        *           application/json:
        *               schema:
        *                    $ref: '#/components/schemas/DTOTienda'
        *     responses:
        *       200:
        *         description:  Petición que confirma la modificacion de el ariticulo.
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOTienda'
        *       404:
        *          description: Devuelve un error debido a que un articulo no existe.
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: TIG0001
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: No se ha encontrado el articulo con código 1
        *       422:
        *          description: Devuelve un error debido a que el formato es incorrecto
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: XXXXXX
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: Bad Format     
        */
        this.router.put('/:identificador', this.update.bind(this))
        /**
        * @openapi
        * /Tienda/{identificador}:
        *   delete:
        *     tags:
        *     - Tienda
        *     summary: Elimina un articulo de la tienda
        *     description: Petición que elimina un articulo mediante el parametro indicador. saldrá un DTO de Tienda para confirmar que se ha eliminado.
        *     parameters:
        *       - in: path
        *         name: identificador
        *         required: true
        *         description: Identificador Tienda
        *         schema:
        *           type: string   
        *     responses:
        *       200:
        *         description:  Petición que elimina uno de los ariticulos.
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOTienda'
        *       400:
        *          description: Devuelve un error debido a que el articulo no existe.
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: TID0001
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: No se ha encontrado el articulo que se quería eliminar     
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
            this.logFunction(req.method, "Realizando peticion Tienda" + req.path)
            let listaFindAll: FindAll[] = await this.servicio.findAll();
            let listaDTOTienda: DTOFindAll[] = [];
            listaFindAll.forEach(idTienda => {
                listaDTOTienda.push(idTienda.asDTO())
            })
            this.circuitBreaker.correcto()
            res.status(200).send(listaDTOTienda);
            this.logFunction(req.method, "Se ha realizado la petición devolver todos los articulos correctamente", res.statusCode.toString())

        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    };

    // GET /Tienda/:identificador
    public async findById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando peticion de articulo" + req.path)
            let objeto: Tienda | undefined = await this.servicio.find(req.params.identificador);
            if (objeto == undefined) {
                throw new APIException(404, "PAGT0000", "Not found.")
            }
            this.circuitBreaker.correcto()
            res.status(200).send(objeto.asDTO());
            this.logFunction(req.method, "Se ha realizado la petición devolver un articulo correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    }
    // POST /Tienda
    public async insert(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando una alta de articulo" + req.path)
            let dto = BuilderDTOTienda.build(req.body);
            if (!dto.validar()) {
                throw new APIException(422, "XXX", "Bad format.");
            }
            let objeto = await this.servicio.insert(dto);
            this.circuitBreaker.correcto()
            res.status(200).send(objeto.asDTO());
            this.logFunction(req.method, "Se ha realizado la petición de alta articulo correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err,next)
        }
    }

    // PUT /Tienda/:identificador
    public async update(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando modificación de un articulo" + req.path)
            let dto = BuilderDTOTienda.build(req.body);
            dto.id = req.params.identificador
            if (!dto.validar()) {
                throw new APIException(422, "XXX", "Bad format.");
            }
            let Tienda = await this.servicio.modify(dto);
            this.circuitBreaker.correcto()
            res.status(200).send(Tienda.asDTO());
            this.logFunction(req.method, "Se ha realizado la modificación del articulo correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    };

    // Delete /Tienda/:identificador
    public async delete(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando una baja de Tienda" + req.path)
            const identificador = req.params.identificador;
            let Tienda = await this.servicio.delete(identificador);
            this.circuitBreaker.correcto()
            res.status(200).send(Tienda.asDTO());
            this.logFunction(req.method, "Se ha eliminado la Tienda correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    }

    //Get /status del servidor
    public getStatus(req: express.Request, res: express.Response) {
        switch (this.circuitBreaker.getEstado()) {
            case CircuitBreakerState.CLOSED: {
                res.status(200).json({ mensaje: "El servidor está correctamente: Tienda" });
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
                next(new ErrorCircuitBreaker("CBTT", "Ha saltado el CircuitBreaker en Tienda"))
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