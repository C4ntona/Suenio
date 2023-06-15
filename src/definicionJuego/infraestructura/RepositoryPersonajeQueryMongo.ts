import { FindAll } from "../domain/FindAll.js";
import { Personaje } from "../domain/Personaje.js";
import { PersonajeRepositoryQuery } from "../domain/PersonajeRepositoryQuery.js";
import { DTOEventoPersonaje } from "../domain/dto/DTOEventoPersonaje.js";
import { MONGO_QUERY_001 } from "./query/MONGO_QUERY_001.js";
import { BuilderDTOPersonaje } from "./BuilderDTOPersonaje.js";
import { BuilderPersonaje } from "./BuilderPersonaje.js";
import * as mongoose from "mongoose";

export class RepositoryPersonajeQueryMongo implements PersonajeRepositoryQuery {
  public static readonly NAME = "RepositoryPersonajeQueryMongo";

  public static readonly COLLECTION = "personaje-api";

  private client: mongoose.Collection<mongoose.AnyObject>

  public constructor(args: Map<string, string>) {
    this.client = this.connectBBDD(args);
  }

  private connectBBDD(args: Map<string, string>) {
    const mongo = args.get("MONGO_DB")
    if (!mongo)
      throw Error("No se ha podido establecer la conexión con MongoDB")
    const conn = mongoose.createConnection(mongo).useDb("api-test")
    return conn.collection("personaje-api");
  }

  public getName(): string {
    return RepositoryPersonajeQueryMongo.NAME
  }

  public async findAll(): Promise<FindAll[]> {
    let listaFindAll: FindAll[] = []
    let dtoEventos: DTOEventoPersonaje[] = []
    const query = MONGO_QUERY_001.load()
    .setParameter("collection", "personaje-api")
    .build();
    const busqueda = this.client.aggregate(query)

    const mongoEventos = await busqueda.toArray() as any[];
    dtoEventos = mongoEventos.map(dto => dto[RepositoryPersonajeQueryMongo.COLLECTION] as DTOEventoPersonaje);
    dtoEventos.forEach((value: DTOEventoPersonaje) => {
      const identificador = value.identificador ? value.identificador : "";
      const nombre = value.datos?.nombre ? value.datos?.nombre : "";
      listaFindAll.push(new FindAll(identificador, nombre))
    });
    return listaFindAll;
  }

  public async find(identificadorParametro: string): Promise<Personaje | undefined> {
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
          "personaje-api": {
            "$first": "$$ROOT"
          }
        }
      },
      {
        $match: {
          "personaje-api.evento": {
            $ne: "Delete"
          }
        }
      },
      {
        $project: {
          _id: 0,
          "personaje-api": 1

        }
      }
    ])
    const mongoEvento = await query.next() as any;

    if (!mongoEvento) {
      return undefined;
    }
    let dtoEvento = mongoEvento[RepositoryPersonajeQueryMongo.COLLECTION] as DTOEventoPersonaje;
    if (!dtoEvento?.datos) {
      return undefined;
    }

    const dto = BuilderDTOPersonaje.build(dtoEvento?.datos)
    const personaje :Personaje = BuilderPersonaje.build(dto)

    return personaje;
  }

  insert(personaje: Personaje): void {
    //TODO Eliminar metodos 
  }
  delete(identificador: string): void {
    //TODO Eliminar metodos 
  }
}