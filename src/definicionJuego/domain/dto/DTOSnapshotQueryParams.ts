import express from 'express-serve-static-core';
import { APIException } from '../../../commons/APIException';

export class DTOSnapshotQueryParams {
  public timestamp: number | undefined;
  public nombre: string | undefined;

  public constructor(entrada: express.Query) {
    this.timestamp = entrada.timestamp ? parseInt(entrada.timestamp.toString()) : undefined;
    this.nombre = entrada.nombre?.toString();
    this.validar(Object.keys(entrada))
  }

  public validar(nombresParametros: string[]) {
    if (!this.timestamp) {
      throw new APIException(404, "XXX", "El parámetro timestamp es obligatorio");
    }
    if (!this.nombre) {
      throw new APIException(404, "XXX", "El parámetro nombre es obligatorio");
    }

    this.validarParametros(nombresParametros)
  }

  private validarParametros(nombresParametros: string[]): boolean {
    const admitidos = ["timestamp", "nombre"];
    let noAdmitidos = nombresParametros.filter(nombre => !admitidos.includes(nombre));
    if (noAdmitidos.length > 0) {
      throw new APIException(404, "XXX", "Parametros admitidos:" + admitidos)
    }
    return true
  }
}