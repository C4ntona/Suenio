import { APIException } from "../../commons/APIException.js";
import { Personaje } from "../domain/Personaje.js";
import { EventoPersonaje } from "../domain/EventoPersonaje.js";
import { PersonajeRepositoryCommand } from "../domain/PersonajeRepositoryCommand.js";
import { PersonajeRepositoryQuery } from "../domain/PersonajeRepositoryQuery.js";
import { DependencyContainer } from "../../commons/dependecy-container/DependencyContainer.js";
import * as mongoose from "mongoose";

export class RepositoryPersonajeCommandMongo implements PersonajeRepositoryCommand {
  public static NAME = "RepositoryPersonajeCommandMongo";

  private repoQuery: PersonajeRepositoryQuery;
  private client: mongoose.Collection<mongoose.AnyObject>;

  public constructor(args: Map<string, string>) {
    this.repoQuery = DependencyContainer.getInstance().getPersonajeRepoQuery();
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
    return RepositoryPersonajeCommandMongo.NAME
  }

  public async insert(objetoPersonaje: Personaje): Promise<Personaje> {
    let objeto: Personaje | undefined = await this.repoQuery.find(objetoPersonaje.getIdentificador());
    if (objeto != undefined) {
      throw new APIException(404, "PERI0001", "El personaje con el código " + objetoPersonaje.getIdentificador() + " ya existe")
    }
    let objEvento: EventoPersonaje = new EventoPersonaje(new Date(), "Personaje", "Insert", objetoPersonaje,objetoPersonaje.getIdentificador())
    await this.client.insertOne(objEvento)

    return objetoPersonaje;
  }

  public async modify(objetoPersonaje: Personaje): Promise<Personaje> {
    let objeto: Personaje | undefined = await this.repoQuery.find(objetoPersonaje.getIdentificador());
    if (objeto == undefined) {
      throw new APIException(404, "PERM0001", "El personaje con el código " + objetoPersonaje.getIdentificador() + " no existe")
    }
    let objEvento: EventoPersonaje = new EventoPersonaje(new Date(), 'Personaje', 'Modify', objetoPersonaje, objetoPersonaje.getIdentificador());
    await this.client.insertOne(objEvento)

    return objetoPersonaje;
  }

  public async delete(identificador: string): Promise<Personaje> {
    let objeto: Personaje | undefined = await this.repoQuery.find(identificador)
    if (objeto == undefined) {
      throw new APIException(404, "PERD0001", "El tipo test con el código " + identificador + " no existe")
    }
    let objEvento: EventoPersonaje = new EventoPersonaje(new Date(), "Personaje", "Delete", undefined, identificador)
    await this.client.insertOne(objEvento)

    return objeto;
  }
}