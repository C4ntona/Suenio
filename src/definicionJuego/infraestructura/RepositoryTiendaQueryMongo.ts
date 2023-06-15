import { FindAll } from "../domain/FindAll.js";
import { Tienda } from "../domain/Tienda.js"
import { TiendaRepositoryQuery } from "../domain/TiendaRepositoryQuery.js";
import { MONGO_QUERY_001 } from "./query/MONGO_QUERY_001.js";
import { DTOEventoTienda } from "../domain/dto/DTOEventoTienda.js";
import { BuilderDTOTienda } from "./BuilderDTOTienda.js";
import { BuilderTienda } from "./BuilderTienda.js";
import * as mongoose from "mongoose";

export class RepositoryTiendaQueryMongo implements TiendaRepositoryQuery {
    public static readonly NAME = "RepositoryTiendaQueryMongo";

    public static readonly COLLECTION = "tienda-api";

    private client: mongoose.Collection<mongoose.AnyObject>

    public constructor(args: Map<string, string>) {
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
        return RepositoryTiendaQueryMongo.NAME
    }

    public async findAll(): Promise<FindAll[]> {
        let listaFindAll: FindAll[] = []
        let dtoEventos: DTOEventoTienda[] = [];
        const query = MONGO_QUERY_001.load()
            .setParameter("collection", "tienda-api")
            .build();
        const busqueda = this.client.aggregate(query)

        const mongoEventos = await busqueda.toArray() as any[];
        dtoEventos = mongoEventos.map(dto => dto[RepositoryTiendaQueryMongo.COLLECTION] as DTOEventoTienda);
        dtoEventos.forEach((value: DTOEventoTienda) => {
            const identificador = value.identificador ? value.identificador : "";
            const nombre = value.datos?.nombre ? value.datos?.nombre : "";
            listaFindAll.push(new FindAll(identificador, nombre))
        });
        return listaFindAll;
    }

    public async find(identificadorParametro: string): Promise<Tienda | undefined> {
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
                    "tienda-api": {
                        "$first": "$$ROOT"
                    }
                }
            },
            {
                $match: {
                    "tienda-api.evento": {
                        $ne: "Delete"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    "tienda-api": 1

                }
            }
        ])
        const mongoEvento = await query.next() as any;

        if (!mongoEvento) {
            return undefined;
        }

        let dtoEvento = mongoEvento[RepositoryTiendaQueryMongo.COLLECTION] as DTOEventoTienda;

        if (!dtoEvento?.datos) {
            return undefined;
        }

        const dto = await BuilderDTOTienda.build(dtoEvento?.datos as any);
        const tienda: Tienda = await BuilderTienda.build(dto)

        return tienda;
    }

    insert(tienda: Tienda): void {
        //TODO Eliminar metodos 
    }
    delete(identificador: string): void {
        //TODO Eliminar metodos 
    }
}