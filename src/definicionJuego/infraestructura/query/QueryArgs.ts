export abstract class QueryArgs {

    protected parameters: Map<String, any> = new Map();
    protected abstract query: Object;

    public static load(): QueryArgs {
        return new (this as any)();
    }

    public setParameter(key: string, value: any): QueryArgs {
        this.parameters.set(key, value);
        return this;
    }

    public build(): any {
        let queryString = JSON.stringify(this.query)
        for (const key of this.parameters.keys()) {
            const value = this.parameters.get(key);
            const regex = new RegExp(`&${key}`, 'g');
            queryString = queryString.replace(regex, value) ;
        }
        return JSON.parse(queryString);
    }
}