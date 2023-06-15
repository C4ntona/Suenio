export enum CircuitBreakerState {
    CLOSED,
    HALF_OPEN, 
    OPEN,
}
export class CircuitBreaker {

    private contadorFallos: number
    private estado: CircuitBreakerState
    private numeroFallosMaximo: number


    public constructor(numeroFallosMaximo:number){
        this.contadorFallos = 0;
        this.estado = CircuitBreakerState.CLOSED
        this.numeroFallosMaximo = numeroFallosMaximo
    }

    public evaluarPeticion(){
        ++this.contadorFallos
        if (this.contadorFallos >= 3) {
            this.estado = CircuitBreakerState.OPEN
        } else {
            this.estado = CircuitBreakerState.HALF_OPEN
        }
    }
    public correcto(){
        this.contadorFallos = 0;
        this.estado = CircuitBreakerState.CLOSED
    }

    public getEstado(){
        return this.estado
    }

    public setEstado(estado: CircuitBreakerState){
        this.estado = estado
    }

}