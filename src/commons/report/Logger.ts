
import {Utils} from '../Utils'

export class Logger {

  private tipoLog: string;
  private mensaje: string;
  private codigoPeticion?: string;
  private tipoPeticion?: string;
  private timeStamp: number;

  public constructor(tipoLog: string, mensaje: string, tipoPeticion?: string, codigoPeticion?: string, timeStamp?: number) {
    this.tipoLog = tipoLog
    if (tipoPeticion) {
      this.tipoPeticion = tipoPeticion
    }
    if (codigoPeticion) {
      this.codigoPeticion = codigoPeticion
    }
    this.mensaje = mensaje;
    this.timeStamp = (timeStamp) ? timeStamp : new Date().getTime();
  }

  public toString(): string {
    let logString = `Tipo de Log: ${this.tipoLog}\nMensaje: ${this.mensaje}\nFecha de Log: ${Utils.fechaHoraFormateada(this.timeStamp)}\n`;
    if (this.tipoPeticion) {
      logString += `Tipo de Petición: ${this.tipoPeticion}\n`;
    }
    if (this.codigoPeticion) {
      logString += `Código de Petición: ${this.codigoPeticion}\n`;
    }
    return logString;
  }

  public getTipoLog(): string {
    return this.tipoLog;
  }

  public getMensaje(): string {
    return this.mensaje;
  }

  public getCodigoPeticion(): string | undefined {
    return this.codigoPeticion;
  }

  public getTipoPeticion(): string | undefined {
    return this.tipoPeticion;
  }

  public getTimestamp(): number {
    return this.timeStamp
  }

}