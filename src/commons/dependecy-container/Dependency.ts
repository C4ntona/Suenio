export type FunctionType<T> = (...args: any[]) => T;

interface Executable {
}

export interface Closeable extends Executable {
    Closeable: Executor<Closeable>
    onExit(): Promise<boolean>;
}

export interface Initializable extends Executable {
    Initializable: Executor<Initializable>
    onInit(): Promise<boolean>;
}

export class Executor<Executable> {

    private f: FunctionType<Promise<boolean>>;

    constructor(f: FunctionType<Promise<boolean>>) {
        this.f = f;
    }

    static define(f: FunctionType<Promise<boolean>>){
        return new Executor(f);
    }

    public async execute(args?: any): Promise<boolean>{
        return await this.f(args);
    }

}

export interface Dependency {
    getName(): string;
}