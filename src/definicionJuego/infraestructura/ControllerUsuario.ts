import express from 'express';
import { BuilderDTOUsuario } from './BuilderDTOUsuario.js';
import { Usuario } from "../domain/Usuario.js";
import { ServicioUsuario } from '../application/servicioUsuario.js';
import { APIException } from "../../commons/APIException.js";
import { ServicioLog } from "../../commons/report/ServicioLog.js";
import { CircuitBreaker, CircuitBreakerState } from "./../domain/circuitBreaker/CircuitBreaker.js";
import { ErrorCircuitBreaker } from "./../../commons/ErrorCircuitBreaker.js";
import { FindAll } from '../domain/FindAll.js';
import { DTOFindAll } from '../domain/dto/DTOFindAll.js';
import { BuilderUsuario } from './BuilderUsuario.js';


export class ControllerUsuario {
    private servicio: ServicioUsuario;
    private router: express.Router;
    private circuitBreaker: CircuitBreaker;

    public constructor(servicio: ServicioUsuario) {
        this.servicio = servicio;
        this.router = express.Router();
        /**
        * @openapi
        * /Usuario:
        *   get:
        *     tags:
        *     - Usuario
        *     summary: Devuelve todos los usuarios
        *     description: Petición que devuelve todos los usuarios existentes.
        *     responses:
        *       200:
        *         description:  Devuelve un Array con los identificadores de los usuarios.
        *         content:
        *           application/json:
        *             schema:
        *               type: array
        *               items:
        *                 $ref: '#/components/schemas/DTOUsuario'
        *       204:
        *         description: No hay ningun usuario.
        */
        this.router.get('/', this.findAll.bind(this))
        /**
        * @openapi
        * /Usuario/{identificador}:
        *   get:
        *     tags:
        *     - Usuario
        *     summary: Devuelve un usuario especificado por parametro
        *     description: Petición que devuelve un usuario existente mediante el parametro indicado
        *     parameters:
        *       - in: path
        *         name: identificador
        *         required: true
        *         description: Identificador Usuario
        *         schema:
        *           type: string           
        *     responses:
        *       200:
        *         description:  Petición que devuelve uno de los usuarios que se indique por parametro existentes.
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOUsuario'
        *       404:
        *          description: Devuelve un error debido a que la Usuario no existe
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: USG0001
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: No se ha encontrado la operación con código 1      
        */
        this.router.get('/:identificador', this.findById.bind(this))
        /**
        * @openapi
        * /Usuario:
        *   post:
        *     tags:
        *     - Usuario
        *     summary: Añade un Usuario
        *     description: Petición que añade una Usuario con los parametros indicados
        *     parameters:
        *       - in: path
        *         name: identificador
        *         required: true
        *         description: Identificador Usuario
        *         schema:
        *           type: string       
        *     requestBody:
        *       required: true
        *       content:
        *           application/json:
        *               schema:
        *                    $ref: '#/components/schemas/DTOUsuario'
        *     responses:
        *       200:
        *         description:  Petición que añade el Usuario y devuelve su JSON.
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOUsuario'
        *       404:
        *          description: Devuelve un error debido a que la Usuario o su contraseña no son correctas
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: USG0001
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: No se ha encontrado la operación con código 1
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
        this.router.post('/:identificador', this.findKey.bind(this))
        /**
        * @openapi
        * /Usuario:
        *   post:
        *     tags:
        *     - Usuario
        *     summary: Login un Usuario
        *     description: Petición que compruba el incio de sesión de un Usuario 
        *     requestBody:
        *       required: true
        *       content:
        *         type: object
        *         properties:
        *           password:
        *             type: string
        *             description: Contrseña del usuario
        *             example: L0sH3rm4n0sP010
        *     responses:
        *       200:
        *         description:  Petición que comprueba y devuelve su JSON.
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOUsuario'
        *       409:
        *          description: Devuelve un error debido a que la Usuario ya existe
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: USG0002
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: Contraseña o usuario incorrectos.     
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
        * /Usuario/{identificador}:
        *   put:
        *     tags:
        *     - Usuario
        *     summary: Modifica un Usuario
        *     description: Petición que modifica un Usuario con los parametros indicados
        *     parameters:
        *       - in: path
        *         name: identificador
        *         required: true
        *         description: Identificador Usuario
        *         schema:
        *           type: string   
        *     requestBody:
        *       required: true
        *       content:
        *           application/json:
        *               schema:
        *                    $ref: '#/components/schemas/DTOUsuario'
        *     responses:
        *       200:
        *         description:  Petición que devuelve un usuario modificado por los campos del body y se generará una nueva versión de Usuario
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOUsuario'
        *       404:
        *          description: Devuelve un error debido a que el Usuario no existe.
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: USG0001
        *                        ERR_MESSAGE:
        *                           type: string
        *                           description: Mensaje de error
        *                           example: No se ha encontrado la operación con código 1
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
        * /Usuario/{identificador}:
        *   delete:
        *     tags:
        *     - Usuario
        *     summary: Elimina un Usuario
        *     description: Petición que elimina una Usuario
        *     parameters:
        *       - in: path
        *         name: identificador
        *         required: true
        *         description: Identificador Usuario
        *         schema:
        *           type: string   
        *     responses:
        *       200:
        *         description:  Petición que elimina un Usuario
        *         content:
        *           application/json:
        *             schema:
        *                 $ref: '#/components/schemas/DTOUsuario'
        *       400:
        *          description: Devuelve un error debido a que el Usuario no existe.
        *          content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                        ERR_CODE:
        *                           type: string
        *                           description: Código de error
        *                           example: USD0001
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
            this.logFunction(req.method, "Realizando peticion Usuario" + req.path)
            let listaFindAll: FindAll[] = await this.servicio.findAll();
            let listaDTOUser: DTOFindAll[] = [];
            listaFindAll.forEach(idUser => {
                listaDTOUser.push(idUser.asDTO())
            })
            this.circuitBreaker.correcto()
            res.status(200).send(listaDTOUser);
            this.logFunction(req.method, "Se ha realizado la petición devolver todos Usuario correctamente", res.statusCode.toString())

        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    };

    // GET /usuario/:identificador
    public async findById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando peticion a una Usuario" + req.path)
            let objeto: Usuario | undefined = await this.servicio.find(req.params.identificador);
            if (objeto == undefined) {
                throw new APIException(404, "USG0001", "Not found.")
            }
            this.circuitBreaker.correcto()
            res.status(200).send(objeto.asDTO());
            this.logFunction(req.method, "Se ha realizado la petición devolver una Usuario correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    }

    // POST /usuario/:identificador
    public async findKey(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando peticion a un Usuario" + req.path)
            let objeto: Usuario | undefined = await this.servicio.find(req.params.identificador);
            if (objeto == undefined) {
                throw new APIException(404, "USG0002", "Correo o contraseña incorrectas.")
            }
            let dto = objeto.asDTO();
            this.circuitBreaker.correcto()
            let object = await BuilderUsuario.buildAccess(dto,req.body.password);
            res.status(200).send(object.asDTO());
            this.logFunction(req.method, "Se ha realizado la petición logear un Usuario correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    }

    // POST /usuario
    public async insert(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando una alta de Usuario" + req.path)
            let dto = BuilderDTOUsuario.build(req.body);
            if (!dto.validar()) {
                throw new APIException(422, "XXX", "Bad format.");
            }
            let objeto = await this.servicio.insert(dto);
            this.circuitBreaker.correcto()
            res.status(200).send(objeto.asDTO());
            this.logFunction(req.method, "Se ha realizado la petición de alta Usuario correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err,next)
        }
    }

    // PUT /usuario/:identificador
    public async update(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando modificación a una Usuario" + req.path)
            let dto = BuilderDTOUsuario.build(req.body);
            dto.identificador = req.params.identificador
            if (!dto.validar()) {
                throw new APIException(422, "XXX", "Bad format.");
            }
            let Usuario = await this.servicio.modify(dto);
            this.circuitBreaker.correcto()
            res.status(200).send(Usuario.asDTO());
            this.logFunction(req.method, "Se ha realizado la modificación de la Usuario correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    };

    // Delete /usuario/:identificador
    public async delete(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            this.logFunction(req.method, "Realizando una baja de Usuario" + req.path)
            const identificador = req.params.identificador;
            let usuario = await this.servicio.delete(identificador);
            this.circuitBreaker.correcto()
            res.status(200).send(usuario.asDTO());
            this.logFunction(req.method, "Se ha eliminado la Usuario correctamente", res.statusCode.toString())
        } catch (err: any) {
            this.exceptionHandler(req, res, err, next)
        }
    }

    //Get /status del servidor
    public getStatus(req: express.Request, res: express.Response) {
        switch (this.circuitBreaker.getEstado()) {
            case CircuitBreakerState.CLOSED: {
                res.status(200).json({ mensaje: "El servidor está correctamente: Usuario" });
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
                next(new ErrorCircuitBreaker("CBTT", "Ha saltado el CircuitBreaker en TipoTest"))
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