import express from 'express-serve-static-core';

//TODO: !!! Desacoplar express del DTO
export class DTOLoggerQueryParams {

  public tipoLog: string | undefined;
  public codigoPeticion: string | undefined;
  public tipoPeticion: string | undefined;
  public fechaInicio: number | undefined;
  public fechaFin: number | undefined;

  public constructor(entrada: express.Query) {
    this.tipoLog = entrada.tipoLog?.toString();
    this.codigoPeticion = entrada.codigoPeticion?.toString();
    this.tipoPeticion = entrada.tipoPeticion?.toString();
    this.fechaInicio = entrada.fechaInicio ? parseInt(entrada.fechaInicio?.toString()) : undefined;
    this.fechaFin = entrada.fechaFin ? parseInt(entrada.fechaFin?.toString()) : undefined;
  }

}