export class Utils {

  public static fechaFormateada(timeStamp: number):string{
      const date = new Date(timeStamp)
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
  }

  public static fechaHoraFormateada(timeStamp: number):string{
      const date = new Date(timeStamp)
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date);
  }
}