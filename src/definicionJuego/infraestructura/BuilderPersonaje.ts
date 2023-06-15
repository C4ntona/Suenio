import { DTOPersonaje } from "../domain/dto/DTOPersonaje";
import { Personaje } from '../domain/Personaje';
import { AtributoPersonaje } from "../domain/AtributoPersonaje";
import { DTOAtributoPersonaje } from "../domain/dto/DTOAtributosPersonaje";
import { HabilidadPersonaje } from "../domain/HabilidadPersonaje";
import { DTOHabilidadPersonaje } from "../domain/dto/DTOHabilidadPersonaje";
import { HechizosPersonaje } from "../domain/HechizoPersonaje";
import { DTOHechizoPersonaje } from "../domain/dto/DTOHechizosPersonaje";
import { EquipoPesonaje } from "../domain/EquipoPersonaje";
import { DTOEquipoPersonaje } from "../domain/dto/DTOEquipoPersonaje";
import { ObjetoPesonaje } from "../domain/ObjetoPersonaje";
import { DTOObjetoPesonaje } from "../domain/dto/DTOObjetoPersonaje";

export class BuilderPersonaje{

    public static build(objetoDTO:DTOPersonaje):Personaje{
        return new Personaje(
            objetoDTO.id, 
            objetoDTO.clase,
            objetoDTO.nombre,
            objetoDTO.raza,
            objetoDTO.nivel,
            objetoDTO.alineamiento,
            objetoDTO.experiencia,
            objetoDTO.trasfondo,
            objetoDTO.rasgos,
            objetoDTO.salud,
            this.formarParametrosAtributos(objetoDTO),
            this.formarParametrosHabilidades(objetoDTO),
            this.formarParametrosHechizos(objetoDTO),
            this.formarParametrosEquipo(objetoDTO),
            this.formarParametrosobjetos(objetoDTO)
            
        )
    }

    public static buildAnonymous(objetoDTO:DTOPersonaje):Personaje{
        objetoDTO.id = "Anonymus" + new Date().toString()+objetoDTO.nombre;
        return this.build(objetoDTO)
    }

    private static formarParametrosAtributos(objetoDTO:DTOPersonaje):AtributoPersonaje[]{
        let listaParametros : AtributoPersonaje[]=[];
        objetoDTO.atributos.forEach((parametro:DTOAtributoPersonaje)=>{
            listaParametros.push(new AtributoPersonaje(parametro.agilidad,parametro.carisma,parametro.constitucion,parametro.fuerza,parametro.inteligencia,parametro.inteligencia))
        })
        return listaParametros
    }

    private static formarParametrosHabilidades(objetoDTO:DTOPersonaje):HabilidadPersonaje[]{
        let listaParametros : HabilidadPersonaje[]=[];
        objetoDTO.habilidades.forEach((parametros:DTOHabilidadPersonaje)=>{
            listaParametros.push(new HabilidadPersonaje(parametros.acrobatics,parametros.animal_handling,parametros.arcana,parametros.athletics,parametros.deception,parametros.history,parametros.insight,parametros.intimidation,parametros.investigation,parametros.medicine,parametros.nature,parametros.perception,parametros.performance,parametros.persuasion,parametros.religion,parametros.sleight_ofhand,parametros.stealth,parametros.survival))
        })
        return listaParametros
    }

    private static formarParametrosHechizos(objetoDTO:DTOPersonaje):HechizosPersonaje[]{
        let listaParametros : HechizosPersonaje[]=[];
        objetoDTO.hechizos.forEach((parametro:DTOHechizoPersonaje)=>{
            listaParametros.push(new HechizosPersonaje(parametro.nombreHechizo))
        })
        return listaParametros
    }

    private static formarParametrosEquipo(objetoDTO:DTOPersonaje):EquipoPesonaje[]{
        let listaParametros : EquipoPesonaje[]=[];
        objetoDTO.equipo.forEach((parametro:DTOEquipoPersonaje)=>{
            listaParametros.push(new EquipoPesonaje(parametro.nombreEquipo))
        })
        return listaParametros
    }

    private static formarParametrosobjetos(objetoDTO:DTOPersonaje):ObjetoPesonaje[]{
        let listaParametros : ObjetoPesonaje[]=[];
        objetoDTO.objetos.forEach((parametro:DTOObjetoPesonaje)=>{
            listaParametros.push(new ObjetoPesonaje(parametro.nombreObjeto))
        })
        return listaParametros
    }

}