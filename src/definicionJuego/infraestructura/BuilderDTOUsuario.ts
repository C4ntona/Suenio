import express_aux from 'express-serve-static-core';
import { DTOUsuario } from "../domain/dto/DTOUsuario";
import { DTOPersonaje } from "../domain/dto/DTOPersonaje";

export class BuilderDTOUsuario {

    public static build(body: express_aux.ParamsDictionary): DTOUsuario {
        const identificador = body.identificador;
        const nombre = body.nombre;
        const password = body.password;
        const email = body.email;
        const personajes = this.buildDTOPersonajes(body.personajes)
        return new DTOUsuario(identificador, nombre, password, email, personajes);
    }

    private static buildDTOPersonajes(entrada: any): string[] {
        const dto: string[] = [];
        if (entrada != undefined)
            entrada.forEach((personajes: any) => {
                dto.push(personajes
                    );
            })
        return dto;
    }

}