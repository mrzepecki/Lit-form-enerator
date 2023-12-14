import {Field} from "./Field.js";

export class Step {
    constructor(data){
        this.name = data.name
        this.order = data.order
        this.form = this._generateFields(data.form)
    }

    _generateFields (form) {
        return Object.entries(form).map(([name, data]) => new Field(name, data))
    }
}