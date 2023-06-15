import { Partida } from "../domain/Partida.js"
import { APIException } from '../../commons/APIException.js';
import { EventoPartida } from "../domain/EventoPartida.js";
import { PartidaRepositoryCommand } from "../domain/PartidaRepositoryCommand.js";
import { PartidaRepositoryQuery } from "../domain/PartidaRepositoryQuery.js";
import { DependencyContainer } from "../../commons/dependecy-container/DependencyContainer.js";
import * as mongoose from "mongoose";

export class RepositoryPartidaCommandMongo implements PartidaRepositoryCommand {
    public static readonly NAME = "RepositoryPartidaCommandMongo";

    
    private repoQuery: PartidaRepositoryQuery;
    private client: mongoose.Collection<mongoose.AnyObject>


    public constructor(args: Map<string, string>) {
        this.repoQuery = DependencyContainer.getInstance().getPartidaRepoQuery()
        this.client = this.connectBBDD(args);
    }
    private connectBBDD(args: Map<string, string>) {
        const mongo = args.get("MONGO_DB")
        if (!mongo)
            throw Error("No se ha podido establecer la conexión con MongoDB")
        const conn = mongoose.createConnection(mongo).useDb("api-test")
        return conn.collection("partida-api");
    }
    public getName(): string {
        return RepositoryPartidaCommandMongo.NAME
    }

    public async insert(objetoOperaApi: Partida): Promise<Partida> {
        let objEvento: EventoPartida = new EventoPartida(new Date(), "Partida", "Insert", objetoOperaApi, objetoOperaApi.getIdentificador())
        await this.client.insertOne(objEvento)
        return objetoOperaApi
    }

    public async modify(objetoOperaApi: Partida): Promise<Partida> {
        let objeto = await this.repoQuery.find(objetoOperaApi.getIdentificador());
        if (objeto == undefined) {
            throw new APIException(404, "PARM0001", "La partida con el código " + objetoOperaApi.getIdentificador() + " no existe")
        }
        let objEvento: EventoPartida = new EventoPartida(new Date(), "Partida", "Modify", objetoOperaApi, objetoOperaApi.getIdentificador())
        await this.client.insertOne(objEvento)
        return objetoOperaApi
    }

    public async delete(identificador: string): Promise<Partida> {
        let objeto = await this.repoQuery.find(identificador);
        if (objeto == undefined) {
            throw new APIException(404, "PARD0001", "La partida con el código " + identificador + " no existe")
        }
        let objEvento: EventoPartida = new EventoPartida(new Date(), "Partida", "Delete", undefined, identificador)
        await this.client.insertOne(objEvento)
        return objeto
    }
}
