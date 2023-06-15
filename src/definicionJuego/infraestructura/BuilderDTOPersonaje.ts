import express_aux from 'express-serve-static-core';
import { DTOPersonaje } from '../domain/dto/DTOPersonaje';
import { DTOAtributoPersonaje } from "../domain/dto/DTOAtributosPersonaje";
import { DTOHabilidadPersonaje } from "../domain/dto//DTOHabilidadPersonaje";
import { DTOHechizoPersonaje } from "../domain/dto/DTOHechizosPersonaje";
import { DTOEquipoPersonaje } from "../domain/dto/DTOEquipoPersonaje";
import { DTOObjetoPesonaje } from "../domain/dto/DTOObjetoPersonaje";

export class BuilderDTOPersonaje {

    public static build(body: any): DTOPersonaje {
        const id = body.id;
        const clase = body.clase;
        const nombre = body.nombre;
        const raza = body.raza;
        const nivel = parseInt(body.nivel);
        const alineamiento = body.alineamiento;
        const experiencia = parseInt(body.experiencia);
        const trasfondo = body.trasfondo;
        const rasgos = body.rasgos;
        const salud = parseInt(body.salud);
        const atributos = this.buildDTOAtributos(body.atributos)
        const habilidades = this.buildDTOHabilidad(body.habilidades)
        const hechizos = this.buildDTOHechizos(body.hechizos)
        const equipo = this.buildDTOEquipo(body.equipo)
        const objetos = this.buildDTOObjetos(body.objetos)
        return new DTOPersonaje(id,clase, nombre, raza, nivel, alineamiento, experiencia,trasfondo,rasgos,salud,
            atributos,
            habilidades,
            hechizos,
            equipo,
            objetos);
    }

    private static buildDTOAtributos(entrada: any): DTOAtributoPersonaje[] {
        const dto: DTOAtributoPersonaje[] = [];
        if (entrada != undefined)
            entrada.forEach((parametros: any) => {
                dto.push(new DTOAtributoPersonaje(parametros.fuerza,parametros.agilidad,parametros.constitucion,parametros.inteligencia,parametros.sabiduria,parametros.carisma));
            })
        return dto;
    }

    private static buildDTOHabilidad(entrada: any): DTOHabilidadPersonaje[] {
        const dto: DTOHabilidadPersonaje[] = [];
        if (entrada != undefined)
            entrada.forEach((parametros: any) => {
                dto.push(new DTOHabilidadPersonaje(parametros.acrobatics,parametros.animal_handling,parametros.arcana,parametros.athletics,parametros.deception,parametros.history,parametros.insight,parametros.intimidation,parametros.investigation,parametros.medicine,parametros.nature,parametros.perception,parametros.performance,parametros.persuasion,parametros.religion,parametros.sleight_ofhand,parametros.stealth,parametros.survival));
            })
        return dto;
    }

    private static buildDTOHechizos(entrada: any): DTOHechizoPersonaje[] {
        const dto: DTOHechizoPersonaje[] = [];
        if (entrada != undefined)
            entrada.forEach((parametros: any) => {
                dto.push(new DTOHechizoPersonaje(parametros.nombreHechizo));
            })
        return dto;
    }

    private static buildDTOEquipo(entrada: any): DTOEquipoPersonaje[] {
        const dto: DTOEquipoPersonaje[] = [];
        if (entrada != undefined)
            entrada.forEach((parametros: any) => {
                dto.push(new DTOEquipoPersonaje(parametros.nombreEquipo));
            })
        return dto;
    }

    private static buildDTOObjetos(entrada: any): DTOObjetoPesonaje[] {
        const dto: DTOObjetoPesonaje[] = [];
        if (entrada != undefined)
            entrada.forEach((parametros: any) => {
                dto.push(new DTOObjetoPesonaje(parametros.nombreObjeto));
            })
        return dto;
    }
}