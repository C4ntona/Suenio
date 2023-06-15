export class ErrorCircuitBreaker extends Error {
    private codigoError: string;
    private msgError: string;

    constructor(codigoError: string,msgError: string) {
        super();
        this.codigoError = codigoError;
        this.msgError = msgError;
    }

    get getCodigoError():string{
        return this.codigoError;
    }
    get getMsgError():string{
        return this.msgError
    }

    get getMensajeYCodigo():object{
        return {"ERR_CODE":this.codigoError,"ERR_MESSAGE":this.msgError};
    }
}