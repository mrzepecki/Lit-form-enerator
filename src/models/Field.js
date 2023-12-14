import {EqualsLength, MaxLength, MaxNumber, MinLength, MinNumber, Required} from "@lion/ui/form-core.js";

export class Field {
    constructor(name, data) {
        this.name = name
        this.type = data.type
        this.validators = this._validatorsFactory(data.validators) || []
        this.visibility = data.visibility
        this.dataset = data.dataset || null
    }

    _validatorsFactory(validators){

        const parsedValidators = validators.map(item => {
            const [name, value = null] = item.includes(':') ? item.split(':') : [item];
            return { name, value };
        });

        return parsedValidators.map(({ name, value }) => {
            const validators = {
                'required': new Required('', { getMessage: () => 'wartość nie może być pusta' }),
                'min-len': new MinLength(Number(value), { getMessage: () => `ilość znaków/elementów w liście nie może być mniejsza niż ${value}.` }),
                'max-len': new MaxLength(Number(value), { getMessage: () => `ilość znaków/elementów w liście nie może być większa niż ${value}.` }),
                'min-number': new MinNumber(Number(value), { getMessage: () => `wartość liczbowa nie może być mniejsza niż ${value}.` }),
                'max-number': new MaxNumber(Number(value), { getMessage: () => `wartość liczbowa nie może być większa niż ${value}.` }),
                'len': new EqualsLength(Number(value), { getMessage: () => `ilość znaków/elementów w liście musi być równa ${value}.` }),
            };

            if (!validators[name]) {
                throw new Error(`Nieznany typ walidatora: ${name}`);
            }

            return validators[name];
        });
    }

}