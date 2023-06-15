export class DTOSnapshot {
  
    public timestamp: number
    public fecha: Date;
    public nombre: string;
    public snapshot: string;
  
    public constructor(timestamp: number, fecha: Date, nombre: string,snapshot: string) {
      this.timestamp = timestamp
      this.fecha = fecha;
      this.nombre = nombre;
      this.snapshot = snapshot;
    }
  
  }