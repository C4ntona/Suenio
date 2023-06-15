import { Dependency } from "../dependecy-container/Dependency";

export interface LoggerInterface extends Dependency {
  info(mensaje: string,tipoPeticion?:string,codigo?:string): void;
  function(mensaje: string,tipoPeticion?:string,codigo?:string): void;
  warning(mensaje: string,tipoPeticion?:string,codigo?:string): void;
  error(mensaje: string,tipoPeticion?:string,codigo?:string): void;
}