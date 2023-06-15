import { FindAll } from "../domain/FindAll.js";
import { Partida } from "../domain/Partida.js"
import { PartidaRepositoryQuery } from "../domain/PartidaRepositoryQuery.js";
import { MONGO_QUERY_001 } from "./query/MONGO_QUERY_001.js";
import { DTOEventoPartida } from "../domain/dto/DTOEventoPartida.js";
import { BuilderDTOPartida } from "./BuilderDTOPartida.js";
import { BuilderPartida } from "./BuilderPartida.js";
import * as mongoose from "mongoose";

export class RepositoryPartidaQueryMongo implements PartidaRepositoryQuery {
    public static readonly NAME = "RepositoryPartidaQueryMongo";

    public static readonly COLLECTION = "partida-api";

    private client: mongoose.Collection<mongoose.AnyObject>

    public constructor(args: Map<string, string>) {
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
        return RepositoryPartidaQueryMongo.NAME
    }

    public async findAll(): Promise<FindAll[]> {
        let listaFindAll: FindAll[] = []
        let dtoEventos: DTOEventoPartida[] = [];
        const query = MONGO_QUERY_001.load()
            .setParameter("collection", "partida-api")
            .build();
        const busqueda = this.client.aggregate(query)

        const mongoEventos = await busqueda.toArray() as any[];
        dtoEventos = mongoEventos.map(dto => dto[RepositoryPartidaQueryMongo.COLLECTION] as DTOEventoPartida);
        dtoEventos.forEach((value: DTOEventoPartida) => {
            const identificador = value.identificador ? value.identificador : "";
            const nombre = value.datos?.nombre ? value.datos?.nombre : "";
            listaFindAll.push(new FindAll(identificador, nombre))
        });
        return listaFindAll;
    }

    public async find(identificadorParametro: string): Promise<Partida | undefined> {
        const query = this.client.aggregate([
            {
                $match: {
                    identificador: `${identificadorParametro}`
                }
            },
            {
                $sort: {
                    fecha: -1
                }
            },
            {
                $group: {
                    _id: "$identificador",
                    "partida-api": {
                        "$first": "$$ROOT"
                    }
                }
            },
            {
                $match: {
                    "partida-api.evento": {
                        $ne: "Delete"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    "partida-api": 1

                }
            }
        ])
        const mongoEvento = await query.next() as any;

        if (!mongoEvento) {
            return undefined;
        }

        let dtoEvento = mongoEvento[RepositoryPartidaQueryMongo.COLLECTION] as DTOEventoPartida;

        if (!dtoEvento?.datos) {
            return undefined;
        }

        const dto = await BuilderDTOPartida.build(dtoEvento?.datos as any);
        const partida: Partida = await BuilderPartida.build(dto)

        return partida;
    }

    public async findUniqueConstraint(method: string, auth: string, ruta: string): Promise<Partida | undefined> {
        const queryCoincidencia = this.client.aggregate([
            {
                $match: {
                    "datos.method": method,
                    "datos.auth": auth,
                    "datos.ruta": ruta
                }
            },
            {
                $sort: {
                    fecha: -1
                }
            },
        ]);

        const mongoEvento = await queryCoincidencia.toArray();

        if (mongoEvento.length === 0) {
            return undefined;
        }

        const dtoEvento = mongoEvento[0] as DTOEventoPartida;

        if (!dtoEvento?.datos) {
            return undefined;
        }

        const dto = await BuilderDTOPartida.build(dtoEvento.datos);
        const partida: Partida = await BuilderPartida.buildAnonymous(dto);

        return partida;
    }

    public async insert(objetoPartida: Partida): Promise<void> {
        //TODO: Eliminar métodos
    }

    public delete(identificador: string): void {
        //TODO: Eliminar métodos
    }

}