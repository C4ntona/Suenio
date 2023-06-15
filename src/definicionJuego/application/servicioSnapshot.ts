import { RepositorySnapshotImplFicheros } from "./../infraestructura/RepositorySnapshot.js";
import { DTOSnapshotQueryParams } from '../domain/dto/DTOSnapshotQueryParams';
import { Snapshot } from "../domain/Snapshot.js";
import { EventoSnapshot } from "../domain/EventoSnapshot.js";

export class ServicioSnapshot {

    private static instance: ServicioSnapshot;
    private repo: RepositorySnapshotImplFicheros;

    private constructor(repo: RepositorySnapshotImplFicheros) {
        this.repo = repo;
    }

    public static getInstance(): ServicioSnapshot {
        if (ServicioSnapshot.instance == undefined) {
            throw new Error("No se ha inicializado el repositorio en arranque");
        }
        return ServicioSnapshot.instance;
    }

    /**
     * Método para inicializar el repositorio durante la inicialización de la aplicación
     * Si se realiza en otro punto arrojará una excepción
     * 
     * @param repo Instancia del repositorio a utilizar
     */
    public static initialize(repo: RepositorySnapshotImplFicheros): ServicioSnapshot {
        if (ServicioSnapshot.instance != undefined) {
            throw new Error("Se ha intentado inicializar el repositorio fuera del arranque");
        }
        ServicioSnapshot.instance = new ServicioSnapshot(repo);
        return ServicioSnapshot.instance;
    }

    public async getSnapshotByTimestamp(queryDTO: DTOSnapshotQueryParams): Promise<EventoSnapshot<unknown>[]> {
        let listaEventosSnapshot: EventoSnapshot<unknown>[] = []
        if (queryDTO.timestamp != undefined && queryDTO.nombre != undefined) {
            let snapshot = new Snapshot(queryDTO.timestamp, queryDTO.nombre)
            listaEventosSnapshot = await this.repo.getSnapshot(snapshot);
            return listaEventosSnapshot
        }
        return listaEventosSnapshot
    }
}