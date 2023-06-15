import { DTOUsuario } from "../domain/dto/DTOUsuario.js";
import { APIException } from '../../commons/APIException.js';
import { DependencyContainer } from '../../commons/dependecy-container/DependencyContainer.js';
import { Usuario } from '../domain/Usuario.js';
import { object } from "webidl-conversions";
import { Personaje } from "../domain/Personaje.js";

export class BuilderUsuario {

    public static async build(objetoDTO: DTOUsuario): Promise<Usuario> {
        await this.validar(objetoDTO);
        return new Usuario(
            objetoDTO.identificador,
            objetoDTO.nombre,
            objetoDTO.password,
            objetoDTO.email,
            objetoDTO.personajes);
    }

    public static async buildAccess(objetoDTO:DTOUsuario,key:string):Promise<Usuario>{
        await this.validarKey(objetoDTO,key)
        objetoDTO.password == "correcto"
        return this.build(objetoDTO)
    }

    public static async validar(dto: DTOUsuario):Promise<boolean> {
        return await dto.validar() 
            // && await this.validarExistenciaPersonajes(dto) 
    }

    public static async validarKey(dto: DTOUsuario,key:string):Promise<boolean> {
        return await dto.validar() 
             && await this.validarKeyUsuario(dto,key) 
    }

    //TODO Recuperar personajes mediante query

    private static async validarKeyUsuario(dto: DTOUsuario,key:string):Promise<boolean> {
        const objetoUK: Usuario | undefined = await DependencyContainer.getInstance().getUsuarioRepoQuery().find(dto.identificador)
        if(objetoUK == undefined || key != objetoUK.getpassword())
            throw new APIException(404, "USG0002", "Contraseña o email incorrectos")
        return true
    }
}