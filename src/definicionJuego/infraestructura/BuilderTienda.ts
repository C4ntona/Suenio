import { APIException } from "../../commons/APIException";
import { DependencyContainer } from "../../commons/dependecy-container/DependencyContainer";
import { DTOTienda } from "../domain/dto/DTOTienda";
import { FindAll } from "../domain/FindAll";
import { Tienda } from '../domain/Tienda';

export class BuilderTienda {

    public static async build(objetoDTO:DTOTienda):Promise <Tienda>{
        return new Tienda(
            objetoDTO.id, 
            objetoDTO.nombre,
            objetoDTO.precio,
            objetoDTO.descripcion
        )
    }
}