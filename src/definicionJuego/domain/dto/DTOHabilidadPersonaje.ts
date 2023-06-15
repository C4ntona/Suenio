export class DTOHabilidadPersonaje {
    public acrobatics: number;
    public animal_handling: number;
    public arcana: number;
    public athletics: number;
    public deception: number;
    public history: number;
    public insight: number;
    public intimidation: number;
    public investigation: number;
    public medicine: number;
    public nature: number;
    public perception: number;
    public performance: number;
    public persuasion: number;
    public religion: number;
    public sleight_ofhand: number;
    public stealth: number;
    public survival: number;
    
    /**
    * @openapi
    * components:
    *   schemas:
    *     DTOHabilidadPersonaje:
    *       type: object
    *       properties:
    *         identificador:
    *           type: string
    *           description: Identificador de la OperacionApi DTO     *           example: 1
    *         nombre:
    *           type: string
    *           description: Nombre de la OperacionApi DTO     *           example: OperacionApi
    *         method:
    *           type: string
    *           description: Petición de la OperacionApi DTO     *           example: POST
    *         auth:
    *           type: string
    *           description: Autentificacion DTO     *           example: auth
    *         ruta:
    *           type: string
    *           description: Nombre de la ruta de la OperacionApi DTO     *           example: OperacionApi
    *         parametros:
    *           type: string
    *           description: Parametros de la OperacionApi DTO     *           example: [{"nombre":"nombre","contentType":"string","tipo":"body","obligatorio":false}]
    */
    public constructor(acrobatics: number,animal_handling: number,arcana: number,athletics: number,deception: number,history: number,insight: number,intimidation: number,
        investigation: number,medicine: number,nature: number,perception: number,performance: number,persuasion: number,religion: number,sleight_ofhand: number,
        stealth: number,survival: number) {
            this.acrobatics = acrobatics;
            this.animal_handling = animal_handling;
            this.arcana = arcana;
            this.athletics = athletics;
            this.deception = deception;
            this.history = history;
            this.insight = insight;
            this.intimidation = intimidation;
            this.investigation = investigation;
            this.medicine = medicine;
            this.nature = nature;
            this.perception = perception;
            this.performance = performance;
            this.persuasion = persuasion;
            this.religion = religion;
            this.sleight_ofhand = sleight_ofhand;
            this.stealth = stealth;
            this.survival = survival;
    }

    public validar(): boolean {
        return (
            typeof this.acrobatics === 'number' &&
            typeof this.animal_handling  === 'number' &&
            typeof this.arcana === 'number' &&
            typeof this.athletics === 'number' &&
            typeof this.deception === 'number' &&
            typeof this.history === 'number' &&
            typeof this.insight === 'number' &&
            typeof this.intimidation === 'number' &&
            typeof this.investigation === 'number' &&
            typeof this.medicine === 'number' &&
            typeof this.nature === 'number' &&
            typeof this.perception === 'number' &&
            typeof this.performance === 'number' &&
            typeof this.persuasion === 'number' &&
            typeof this.religion === 'number' &&
            typeof this.sleight_ofhand === 'number' &&
            typeof this.stealth === 'number' &&
            typeof this.survival === 'number'
        )
    }
}