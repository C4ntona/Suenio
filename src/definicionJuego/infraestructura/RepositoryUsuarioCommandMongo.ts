import { Usuario } from "../domain/Usuario";
import { UsuarioCommand } from "../domain/UsuarioRepositoryCommand";
import { APIException } from '../../commons/APIException';
import { UsuarioQuery } from "../domain/UsuarioRepositoryQuery";
import { EventoUsuario } from "../domain/EventoUsuario";
import { DependencyContainer } from '../../commons/dependecy-container/DependencyContainer';
import * as mongoose from "mongoose";
import { IdUsuario } from "../domain/IdUsuario";

export class RepositoryUsuarioCommandMongo implements UsuarioCommand {
  public static readonly NAME = "RepositoryUsuarioCommandMongo";
  
  private repoQuery: UsuarioQuery;
  private client: mongoose.Collection<mongoose.AnyObject>

  public constructor(args: Map<string,string>) {
    this.repoQuery = DependencyContainer.getInstance().getUsuarioRepoQuery()
    this.client = this.connectBBDD(args)
  }

  private connectBBDD(args: Map<string, string>) {
    const mongo = args.get("MONGO_DB")
    if (!mongo)
      throw Error("No se ha podido establecer la conexión con MongoDB")
    const conn = mongoose.createConnection(mongo).useDb("api-test")
    return conn.collection("usuario-api");
  }


  public getName(): string {
    return RepositoryUsuarioCommandMongo.NAME
  }


  public async insert(objetoUsuario: Usuario): Promise<Usuario> {
    let objeto: Usuario | undefined = await this.repoQuery.find(objetoUsuario.getemail());
    if (objeto != undefined) {
      throw new APIException(404, "USP0001", "El usuario con el código " + objetoUsuario.getemail() + " ya existe")
    }
    let objEvento: EventoUsuario = new EventoUsuario(new Date(), "Usuario", "Insert", objetoUsuario,objetoUsuario.getemail())
    await this.client.insertOne(objEvento);
    return objetoUsuario;
  }

  public async modify(objetoUsuario: Usuario): Promise<Usuario> {
    let objeto: Usuario | undefined = await this.repoQuery.find(objetoUsuario.getemail());
    if (objeto == undefined) {
      throw new APIException(404, "USU0001", "El usuario con el código " + objetoUsuario.getemail() + " no existe")
    }
    let objEvento: EventoUsuario = new EventoUsuario(new Date(), 'Usuario', 'Modify', objetoUsuario);
    await this.client.insertOne(objEvento);
    return objetoUsuario;
  }

  public async delete(identificador: string): Promise<Usuario> {
    let objeto: Usuario | undefined = await this.repoQuery.find(identificador);
    if (objeto == undefined) {
      throw new APIException(404, "USD0001", "El usuario con el código " + identificador + " no existe")
    }
    let objEvento: EventoUsuario = new EventoUsuario(new Date(), "Usuario", "Delete", undefined, identificador)
    await this.client.insertOne(objEvento);
    return objeto;
  }

  public async modifyId(objetoIdUT: IdUsuario): Promise<Usuario> {
    let objetoActual: Usuario | undefined = await this.repoQuery.find(objetoIdUT.getIdActual());
    let objetoNuevo: Usuario | undefined = await this.repoQuery.find(objetoIdUT.getIdNuevo());
    if(objetoActual == undefined) {
      throw new APIException(404, "USUI001", "El usuario con el código " + objetoIdUT.getIdActual()+ " no existe")
    }else if(objetoNuevo != undefined) {
      throw new APIException(404, "USUI002", "El usuario con el código " + objetoIdUT.getIdNuevo()+ " existe ya por lo que no puede guardarse")
    }
    let objEvento1: EventoUsuario = new EventoUsuario(new Date(), "Usuario", "Delete", undefined,objetoActual.getemail())
    await this.client.insertOne(objEvento1);
    objetoActual.setemail(objetoIdUT.getIdNuevo());
    let objEvento2: EventoUsuario = new EventoUsuario(new Date(), "Usuario", "Insert", objetoActual,objetoActual.getemail())
    await this.client.insertOne(objEvento2);
    return objetoActual;
    
  }

}