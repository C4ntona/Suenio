import * as fs from 'fs';
import { EventoSnapshot } from "../domain/EventoSnapshot";
import { DTOEventoSnapshot } from "../domain/dto/DTOEventoSnapshot";
import { Snapshot } from '../domain/Snapshot';
import { APIException } from '../../commons/APIException';
import { Partida } from '../domain/Partida';
import { BuilderPartida } from './BuilderPartida';
import { BuilderPersonaje } from './BuilderPersonaje';
import { BuilderUsuario } from './BuilderUsuario';
import { Personaje } from '../domain/Personaje';
import { Usuario } from '../domain/Usuario';
import { BuilderDTOUsuario } from './BuilderDTOUsuario';
import { BuilderDTOPartida } from './BuilderDTOPartida';
import { BuilderDTOPersonaje } from './BuilderDTOPersonaje';

export class RepositorySnapshotImplFicheros {

  public async getSnapshot(snapshot: Snapshot): Promise<EventoSnapshot<unknown>[]> {
    let lista: EventoSnapshot<unknown>[] = await this.leerEventos()
    let listaRestante: EventoSnapshot<unknown>[] = []
    if (lista.length == 0) {
      return []
    }
    let listaFiltrada: EventoSnapshot<unknown>[] = lista.filter(event => !snapshot.getTimestamp() || event.getFecha() <= snapshot.getTimestamp())
    listaRestante = lista.filter((event) => !listaFiltrada.includes(event));
    if (listaFiltrada.length == 0) {
      throw new APIException(404, "XXX", "No se se han encontrado eventos anteriores al timestamp: " + snapshot.getTimestamp())
    }
    this.guardarEstadoPersistencia(listaFiltrada);
    fs.writeFileSync("./resources/eventos.json", JSON.stringify(listaRestante));
    return this.crearSnapshot(listaFiltrada, snapshot)
  }

  private crearSnapshot(eventos: EventoSnapshot<unknown>[], snapshot: Snapshot): EventoSnapshot<unknown>[] {
    if (!fs.existsSync("./snapshots/")) {
      fs.mkdirSync("./snapshots/");
    }
    fs.writeFileSync("./snapshots/" + snapshot.getFecha().getTime() + "-" + snapshot.getNombre() + "-snapshot.json", JSON.stringify(eventos));
    return eventos
  }

  private guardarEstadoPersistencia(listaFiltrada: EventoSnapshot<unknown>[]): boolean {
    if (!fs.existsSync("./resources/estadoPersistencia.json")) {
      let data: unknown[] = [];
      fs.writeFileSync("./resources/estadoPersistencia.json", JSON.stringify(data));
    }
    let lecturaEstadoPersistencia = fs.readFileSync('./resources/estadoPersistencia.json', 'utf-8');
    let estadoPersistencia = JSON.parse(lecturaEstadoPersistencia);
    for (const evento of listaFiltrada) {
      estadoPersistencia.push(evento);
      fs.writeFileSync("./resources/estadoPersistencia.json", JSON.stringify(estadoPersistencia));
    }
    return true;
  }

  private async leerEventos(): Promise<EventoSnapshot < unknown > []> {
  let listaEventosGenerico: EventoSnapshot<unknown>[] = []
  if (!fs.existsSync("./resources/eventos.json")) {
    return []
  }
  const contenidoArchivo = fs.readFileSync("./resources/eventos.json", "utf-8")
  JSON.parse(contenidoArchivo).forEach(async (event: DTOEventoSnapshot) => {

    let aux: EventoSnapshot<unknown>;

    switch (event.entidad) {
      case "Personaje":
        if (event.datos) {
          const dto = BuilderDTOPersonaje.build(event.datos)
          const datos = BuilderPersonaje.build(dto)
          aux = new EventoSnapshot<Personaje>(new Date(event.fecha), event.entidad, event.evento, datos, event.identificador);
          listaEventosGenerico.push(aux)
        }
        break;
      case "Partida":
        if (event.datos) {
          const dto = await BuilderDTOPartida.build(event.datos)
          const datos = await BuilderPartida.build(dto)
          aux = new EventoSnapshot<Partida>(new Date(event.fecha), event.entidad, event.evento, datos, event.identificador);
          listaEventosGenerico.push(aux)
        }
        break;
      case "Usuario":
        if (event.datos) {
          const dto = BuilderDTOUsuario.build(event.datos);
          const datos = await BuilderUsuario.build(dto);
          aux = new EventoSnapshot<Usuario>(new Date(event.fecha), event.entidad, event.evento, datos, event.identificador);
          listaEventosGenerico.push(aux)
        }
        break;

      default:
        throw new Error("Event not recognized.")
    }
  })
  return listaEventosGenerico;
}

}