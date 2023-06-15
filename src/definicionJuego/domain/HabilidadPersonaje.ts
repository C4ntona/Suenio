import { DTOHabilidadPersonaje } from "./dto/DTOHabilidadPersonaje";

export class HabilidadPersonaje {
    private acrobatics: number;
    private animal_handling: number;
    private arcana: number;
    private athletics: number;
    private deception: number;
    private history: number;
    private insight: number;
    private intimidation: number;
    private investigation: number;
    private medicine: number;
    private nature: number;
    private perception: number;
    private performance: number;
    private persuasion: number;
    private religion: number;
    private sleight_ofhand: number;
    private stealth: number;
    private survival: number;

    constructor(acrobatics: number,animal_handling: number,arcana: number,athletics: number,deception: number,history: number,insight: number,intimidation: number,
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

    //Getters
    get getAcrobatics() {
        return this.acrobatics;
    }
    get getAnimal_handling() {
        return this.animal_handling;
    }
    get getArcana() {
        return this.arcana;
    }
    get getAthletics() {
        return this.athletics;
    }
    get getDeception() {
        return this.deception;
    }
    get getHistory() {
        return this.history;
    }
    get getInsight() {
        return this.insight;
    }
    get getIntimidation() {
        return this.intimidation;
    }
    get getInvestigation() {
        return this.investigation;
    }
    get getMedicine() {
        return this.medicine;
    }
    get getNature() {
        return this.nature;
    }
    get getPerception() {
        return this.perception;
    }
    get getPerformance() {
        return this.performance;
    }
    get getPersuasion() {
        return this.persuasion;
    }
    get getReligion() {
        return this.religion;
    }
    get getSleight_ofhand() {
        return this.sleight_ofhand;
    }
    get getStealth() {
        return this.stealth;
    }
    get getSurvival() {
        return this.survival;
    }

    //Setters

    set setacrobatics(acrobatics: number) {
        this.acrobatics = acrobatics;
    }
    set setanimal_handling(animal_handling: number) {
        this.animal_handling = animal_handling;
    }
    set setarcana(arcana: number) {
        this.arcana = arcana;
    }
    set setathletics(athletics: number) {
        this.athletics = athletics;
    }
    set setdeception(deception: number) {
        this.deception = deception;
    }
    set sethistory(history: number) {
        this.history = history;
    }
    set setInsight(insight: number) {
        this.insight = insight;
    }
    set setIntimidation(intimidation: number) {
        this.intimidation = intimidation;
    }
    set setInvestigation(investigation: number) {
        this.investigation = investigation;
    }
    set setMedicine(medicine: number) {
        this.medicine = medicine;
    }
    set getNature(nature: number) {
        this.nature = nature;
    }
    set setPerception(perception: number) {
        this.perception = perception;
    }
    set setPerformance(performance: number) {
        this.performance = performance;
    }
    set setPersuasion(persuasion: number) {
        this.persuasion = persuasion;
    }
    set setReligion(religion: number) {
        this.religion = religion;
    }
    set setSleight_ofhand(sleight_ofhand: number) {
        this.sleight_ofhand = sleight_ofhand;
    }
    set setStealth(stealth: number) {
        this.stealth = stealth;
    }
    set setSurvival(survival: number) {
        this.survival = survival;
    }

    public asDTO(): DTOHabilidadPersonaje {
        return new DTOHabilidadPersonaje(this.acrobatics,this.animal_handling,this.arcana,this.athletics,this.deception,this.history,this.insight,this.intimidation,
            this.investigation,this.medicine,this.nature,this.perception,this.performance,this.persuasion,this.religion,this.sleight_ofhand,this.stealth,this.survival)
    }
}