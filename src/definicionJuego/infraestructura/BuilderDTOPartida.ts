import express_aux from 'express-serve-static-core';
import { DTOPartida } from "../domain/dto/DTOPartida";

export class BuilderDTOPartida {

    public static build(body: any): DTOPartida {
        const identificador = body.identificador;
        const nombre = body.nombre;
        const password = body.password;
        const email = body.email;
        const personajes = this.buildDTOPersonajes(body.personajes)
        return new DTOPartida(identificador, nombre, password, email, personajes);
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