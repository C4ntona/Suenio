// TODO: Revisión borrado
export class Ruta {
    private protocol: string;
    private port: number;
    private app: string;
    private maquina: string;
    private endPoint: string;

    public constructor(protocol: string, port: number, app: string, maquina: string, endPoint: string) {
        this.protocol = protocol;
        this.port = port;
        this.app = app;
        this.maquina = maquina;
        this.endPoint = endPoint;
    }

    public getProtocol() {
        return this.protocol;
    }
    public getPort() {
        return this.port
    }
    public getApp() {
        return this.app
    }
    public getMaquina() {
        return this.maquina
    }
    public getEndPoint() {
        return this.endPoint
    }
    public setProtocol(protocol: string) {
        this.protocol = protocol;
    }
    public setPort(port: number) {
        this.port = port;
    }
    public setApp(app: string) {
        this.app = app;
    }
    public setMaquina(maquina: string) {
        this.maquina = maquina;
    }
    public setEndPotiny(endPoint: string) {
        this.endPoint = endPoint;
    }

    //TODO: Corregir metodo
    public parseRuta(datos: string): Ruta {
        let json: Ruta = JSON.parse(JSON.stringify(datos));
        return json;
    }
}


