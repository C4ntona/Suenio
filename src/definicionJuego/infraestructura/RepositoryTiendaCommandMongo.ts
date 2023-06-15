import { Tienda } from "../domain/Tienda.js"
import { APIException } from '../../commons/APIException.js';
import { EventoTienda } from "../domain/EventoTienda.js";
import { TiendaRepositoryCommand } from "../domain/TiendaRepositoryCommand.js";
import { TiendaRepositoryQuery } from "../domain/TiendaRepositoryQuery.js";
import { DependencyContainer } from "../../commons/dependecy-container/DependencyContainer.js";
import * as mongoose from "mongoose";

export class RepositoryTiendaCommandMongo implements TiendaRepositoryCommand {
    public static readonly NAME = "RepositoryTiendaCommandMongo";

    
    private repoQuery: TiendaRepositoryQuery;
    private client: mongoose.Collection<mongoose.AnyObject>


    public constructor(args: Map<string, string>) {
        this.repoQuery = DependencyContainer.getInstance().getTiendaRepoQuery()
        this.client = this.connectBBDD(args);
    }
    private connectBBDD(args: Map<string, string>) {
        const mongo = args.get("MONGO_DB")
        if (!mongo)
            throw Error("No se ha podido establecer la conexión con MongoDB")
        const conn = mongoose.createConnection(mongo).useDb("api-test")
        return conn.collection("tienda-api");
    }
    public getName(): string {
        return RepositoryTiendaCommandMongo.NAME
    }

    public async insert(objetoOperaApi: Tienda): Promise<Tienda> {
        let objEvento: EventoTienda = new EventoTienda(new Date(), "tienda", "Insert", objetoOperaApi, objetoOperaApi.getIdentificador())
        await this.client.insertOne(objEvento)
        return objetoOperaApi
    }

    public async modify(objetoOperaApi: Tienda): Promise<Tienda> {
        let objeto = await this.repoQuery.find(objetoOperaApi.getIdentificador());
        if (objeto == undefined) {
            throw new APIException(404, "TIAM0001", "El articulo con el código " + objetoOperaApi.getIdentificador() + " no existe")
        }
        let objEvento: EventoTienda = new EventoTienda(new Date(), "tienda", "Modify", objetoOperaApi, objetoOperaApi.getIdentificador())
        await this.client.insertOne(objEvento)
        return objetoOperaApi
    }

    public async delete(identificador: string): Promise<Tienda> {
        let objeto = await this.repoQuery.find(identificador);
        if (objeto == undefined) {
            throw new APIException(404, "TIAD0001", "El articulo con el código " + identificador + " no existe")
        }
        let objEvento: EventoTienda = new EventoTienda(new Date(), "tienda", "Delete", undefined, identificador)
        await this.client.insertOne(objEvento)
        return objeto
    }
}
