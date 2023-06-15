export class DTOLogger {
  
  public tipoLog: string;
  public mensaje: string;
  public codigoPeticion: string;
  public tipoPeticion: string;
  public timeStamp: number;

  public constructor(tipoLog: string, mensaje: string, codigoPeticion: string, tipoPeticion: string, timeStamp: number) {
    this.tipoLog = tipoLog;
    this.mensaje = mensaje;
    this.codigoPeticion = codigoPeticion;
    this.tipoPeticion = tipoPeticion;
    this.timeStamp = timeStamp;
  }

}