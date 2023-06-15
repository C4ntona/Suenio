import { FindAll } from "../domain/FindAll";
import { Usuario } from "../domain/Usuario";
import { UsuarioQuery } from "../domain/UsuarioRepositoryQuery";
import { MONGO_QUERY_001 } from "./query/MONGO_QUERY_001.js";
import { DTOEventoUsuario } from "../domain/dto/DTOEventoUsuario";
import { BuilderUsuario } from "./BuilderUsuario";
import { BuilderDTOUsuario } from "./BuilderDTOUsuario";
import * as mongoose from "mongoose";

export class RepositoryUsuarioQueryMongo implements UsuarioQuery {
  public static readonly NAME = "RepositoryUsuarioQueryMongo";

  public static readonly COLLECTION = "usuario-api";

  private client: mongoose.Collection<mongoose.AnyObject>

  public constructor(args: Map<string, string>) {
    this.client = this.connectBBDD(args);
  }
  
  private connectBBDD(args: Map<string, string>) {
    const mongo = args.get("MONGO_DB")
    if (!mongo)
      throw Error("No se ha podido establecer la conexión con MongoDB")
    const conn = mongoose.createConnection(mongo).useDb("api-test")
    return conn.collection("usuario-api");
  }

  public getName(): string {
    return RepositoryUsuarioQueryMongo.NAME
  }

  public async findAll(): Promise<FindAll[]> {
    let listaFindAll: FindAll[] = []
    let dtoEventos: DTOEventoUsuario[] = []
    const query = MONGO_QUERY_001.load()
    .setParameter("collection", "usuario-api")
    .build();
    const busqueda = this.client.aggregate(query)

    const mongoEventos = await busqueda.toArray() as any[];
    dtoEventos = mongoEventos.map(dto => dto[RepositoryUsuarioQueryMongo.COLLECTION] as DTOEventoUsuario);
    dtoEventos.forEach((value: DTOEventoUsuario) => {
      const identificador = value.identificador ? value.identificador : "";
      const nombre = value.datos?.nombre ? value.datos?.nombre : "";
      listaFindAll.push(new FindAll(identificador, nombre))
    });
    return listaFindAll;
  }
  public async find(identificadorParametro: string): Promise<Usuario | undefined> {
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
          "usuario-api": {
            "$first": "$$ROOT"
          }
        }
      },
      {
        $match: {
          "usuario-api.evento": {
            $ne: "Delete"
          }
        }
      },
      {
        $project: {
          _id: 0,
          "usuario-api": 1

        }
      }
    ])
    const mongoEvento = await query.next() as any;

    if (!mongoEvento) {
      return undefined;
    }
    let dtoEvento = mongoEvento[RepositoryUsuarioQueryMongo.COLLECTION] as DTOEventoUsuario;
    if (!dtoEvento?.datos) {
      return undefined;
    }
    const dto = BuilderDTOUsuario.build(dtoEvento?.datos as any);
    const usuario: Usuario = await BuilderUsuario.build(dto)
    return usuario
  }

  public insert(objetoUsuario: Usuario): void {
    //TODO Borrar estos métodos
  }
  public delete(identificador: string): void {
     //TODO Borrar estos métodos
  }
}
