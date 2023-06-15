export class APIException extends Error {
    private status: number;
    private codigoError: string;
    private msgError: string;

    public constructor(status: number,codigoError: string,msgError: string) {
        super();
        this.status = status;
        this.codigoError = codigoError;
        this.msgError = msgError;
    }

    public getStatus():number{
        return this.status
    }
    public getCodigoError():string{
        return this.codigoError;
    }
    public getMsgError():string{
        return this.msgError
    }

    public getMensajeYCodigo():object{
        return {"ERR_CODE":this.codigoError,"ERR_MESSAGE":this.msgError};
    }
}