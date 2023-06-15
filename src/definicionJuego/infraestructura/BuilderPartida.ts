import { APIException } from "../../commons/APIException";
import { DependencyContainer } from "../../commons/dependecy-container/DependencyContainer";
import { DTOPartida } from "../domain/dto/DTOPartida";
import { FindAll } from "../domain/FindAll";
import { Partida } from '../domain/Partida';

export class BuilderPartida {

    public static async build(objetoDTO:DTOPartida):Promise <Partida>{
        return new Partida(
            objetoDTO.id, 
            objetoDTO.nombre,
            objetoDTO.master,
            objetoDTO.historial,
            objetoDTO.personajes
        )
    }

    public static async buildAnonymous(objetoDTO:DTOPartida):Promise <Partida>{
        objetoDTO.id = "Anonymus" + new Date().toString()+objetoDTO.nombre;
        return this.build(objetoDTO)
    }

    // public static async buildInsert(dto: DTOPartida): Promise<Partida> {
    //     const repositoryQuery = DependencyContainer.getInstance().getPartidaRepoQuery();
    //     if (await repositoryQuery.find(dto.identificador) != undefined) {
    //         throw new APIException(409, "PARI0001", "Ya existe una Partida con el código: " + dto.identificador);
    //     }

    //     return this.buildModify(dto);
    // }

    // public static async buildModify(dto: DTOPartida): Promise<Partida> {
    //     const repositoryQuery = DependencyContainer.getInstance().getPartidaRepoQuery();
    //     let Partida = await this.build(dto);

    //     if (repositoryQuery != undefined) {
    //         const parameterMerge = this.compararParametros(objetoExists.getParametros(), Partida.getParametros())
    //         repositoryQuery.setParametros(parameterMerge);
    //         return repositoryQuery;
    //     }

    //     return Partida;
    // }

    // public static async build(dto: DTOPartida): Promise<Partida> {
    //     let parametros = this.formarParametrosEntradaOperaApi(dto)
    //     await this.validarPartida(dto.auth);

    //     return new Partida(dto.identificador, dto.nombre, dto.method, dto.ruta, dto.auth, parametros)
    // }

    // public static async buildAnonymous(dto: DTOPartida): Promise<Partida> {
    //     dto.identificador = "Anonymus" + new Date().toString() + dto.nombre;
    //     return this.buildInsert(dto);
    // }

    // public static async buildUniqueConstraint(dtoMatch: DTOPartida): Promise<Partida> {
    //     let parametros = this.formarParametrosEntradaOperaApi(dtoMatch)
    //     return new Partida(dtoMatch.identificador, dtoMatch.nombre, dtoMatch.method, dtoMatch.ruta, dtoMatch.auth, parametros)
    // }

    // private static async validarPartida(identificador: string): Promise<boolean> {
    //     let listaIdsAuthorization: FindAll[] = await DependencyContainer.getInstance().getAuthOperacionApiRepoQuery().findAll()
    //     for (const idAuth of listaIdsAuthorization) {
    //         if (idAuth.getNombre() == identificador) {
    //             throw new APIException(404, "AUTH000", "No existe la authorization con el id: " + identificador)
    //         }

    //     }
    //     return true
    // }
}