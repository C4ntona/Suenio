import { Usuario } from "../domain/Usuario.js";
import { FindAll } from "../domain/FindAll.js";
import { UsuarioQuery } from "../domain/UsuarioRepositoryQuery.js";
import { UsuarioServicioQuery } from "../domain/UsuarioServiceQuery.js";
import { UsuarioServicioCommand } from "../domain/UsuarioServiceCommand.js";
import { DTOUsuario } from "../domain/dto/DTOUsuario.js";
import { UsuarioCommand } from "../domain/UsuarioRepositoryCommand.js";
import { BuilderUsuario } from "../infraestructura/BuilderUsuario.js";

export class ServicioUsuario implements UsuarioServicioQuery, UsuarioServicioCommand {

    private static instance: ServicioUsuario;
    private repoUSquery: UsuarioQuery;
    private repoUScommand: UsuarioCommand;

    private constructor(repoUSquery: UsuarioQuery, repoUScommand: UsuarioCommand) {
        this.repoUSquery = repoUSquery;
        this.repoUScommand = repoUScommand;
    }

    public static getInstance(): ServicioUsuario {
        if (ServicioUsuario.instance == undefined) {
            throw new Error("No se ha inicializado el repositorio en arranque");
        }
        return ServicioUsuario.instance;
    }

    /**
     * Método para inicializar el repositorio durante la inicialización de la aplicación
     * Si se realiza en otro punto arrojará una excepción
     * 
     * @param repo Instancia del repositorio a utilizar
     */
    public static initialize(repoUSquery: UsuarioQuery, repoUScommand: UsuarioCommand): ServicioUsuario {
        if (ServicioUsuario.instance != undefined) {
            throw new Error("Se ha intentado inicializar el repositorio fuera del arranque");
        }
        ServicioUsuario.instance = new ServicioUsuario(repoUSquery, repoUScommand);
        return ServicioUsuario.instance;
    }

    public async findAll(): Promise<FindAll[]> {
        return  this.repoUSquery.findAll();
    }
    
    public async find(identificador: string): Promise<Usuario | undefined>{
        return await this.repoUSquery.find(identificador);
    }

    public async insert(objetoDTO: DTOUsuario): Promise<Usuario> {
        let objetoUsuario: Usuario = await BuilderUsuario.build(objetoDTO)
        return await this.repoUScommand.insert(objetoUsuario);
    }

    public async modify(objetoDTO: DTOUsuario): Promise<Usuario> {
        let objetoUsuario: Usuario = await BuilderUsuario.build(objetoDTO)
        return await this.repoUScommand.modify(objetoUsuario);
    }

    public async delete(identificador: string): Promise<Usuario> {
        return await this.repoUScommand.delete(identificador);

    }

}