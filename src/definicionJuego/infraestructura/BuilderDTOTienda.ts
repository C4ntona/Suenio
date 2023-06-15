import express_aux from 'express-serve-static-core';
import { DTOTienda } from "../domain/dto/DTOTienda";

export class BuilderDTOTienda {

    public static build(body: any): DTOTienda {
        const identificador = body.identificador;
        const nombre = body.nombre;
        const precio = body.precio;
        const descripcion = body.descripcion;
        return new DTOTienda(identificador, nombre, precio, descripcion);
    }
}