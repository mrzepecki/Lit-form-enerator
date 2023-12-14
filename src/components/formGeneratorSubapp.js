import {LitElement, html, css} from 'lit';

import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-input-amount.js';
import '@lion/ui/define/lion-form.js';
import '@lion/ui/define/lion-textarea.js';
import '@lion/ui/define/lion-select.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox-indeterminate.js';
import '@lion/ui/define/lion-checkbox.js';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
import '@lion/ui/define/lion-steps.js';
import '@lion/ui/define/lion-step.js';

import {Step} from "../models/Step.js";
import {FormControlMixin} from "@lion/ui/form-core.js";
import {FIELD_VISIBILITY_ENUM} from "../enums/fieldVisibilityEnum.js";
import {conditionChecker} from "../helpers/conditionChecker.js";

export class FormGeneratorSubapp extends FormControlMixin(LitElement) {
	static get styles() {
		return css`
    :host {
      display: block;
      max-width: 500px;
      margin: 0 auto;
      font-family: Arial, 'sans-serif';
      padding: 15px;
    }

    .form-field {
      margin-bottom: 15px;
    }

    .form-field label {
      text-transform: capitalize;
    }

    .step {
      margin-bottom: 20px;
    }

    .step-heading {
      text-transform: capitalize;
    }

    .status {
      color: #fff;
      border-radius: 10px;
      padding: 10px;
      text-align: center;
      margin-top: 10px;
    }

    .success {
      background: #1a851a;
    }

    .error {
      background: #a01713;
    }
		`;
	}
	
	static get properties() {
		return {
			data: {type: Array},
			formData: {type: Object},
			savingStatus: {type: Object},
			error: {type: String},
		};
	}
	
	constructor() {
		super();
		this.data = null;
		this.formData = {};
		this.error = '';
		this.savingStatus = {};
	}
	
	connectedCallback() {
		super.connectedCallback();
		this.fetchData();
	}
	
	async fetchData() {
		const apiUrl = 'http://localhost:3000/api/simple-form'
		await fetch(apiUrl)
			.then(response => response.json())
			.then(data => {
				const dataArray = [...data.map(item => new Step(item))]
				this.data = dataArray.sort((a, b) => a.order - b.order);
			})
			.catch(() => {
				throw new Error('Error while loading data.')
			});
	}
	
	render() {
		if (!this.data) {
			return html`<h1>Ładowanie...</h1>`
		}
		
		return html`
      ${this.renderHeading()}
      ${this.renderForm()}
      ${this.renderValidationError()}
      ${this.renderSavingStatus()}
		`;
	}
	
	renderHeading() {
		return html`<h1 class="heading">Wypełnij formularz</h1>`
	}
	
	renderForm() {
		return html`
      <lion-form @submit=${this.handleSave}>
          <form>
              <lion-steps>
                  ${this.data.map((step, i, arr) => {
                      const isInitalStep = i === 0
                      const isLastStep = i === arr.length - 1

                      return html`
                          <lion-step .initial-step=${isInitalStep}>
                              ${this.renderStep(step)}
                              ${!isInitalStep ? html`
                                  <button type="button" @click=${ev => ev.target.parentElement.controller.previous()}
                                  >
                                      Powrót
                                  </button>
                              ` : ''}
                              ${!isLastStep ? html`
                                  <button type="button"
                                          @click=${ev => ev.target.parentElement.controller.next()}>
                                      Dalej
                                  </button>
                              ` : ''}
                              ${isLastStep ? html`
                                  <button type="submit" .disabled=${this.savingStatus.status === 'success'}>
                                      Zapisz
                                  </button>
                              ` : ''}
                          </lion-step>
                      `
                  })}
              </lion-steps>
          </form>
      </lion-form>
		`
	}
	
	renderStep(step) {
		return html`
      <div class="step">
          <p>Strona ${step.order}</p>
          <h2 class="step-heading">${step.name}</h2>
          ${step?.form.map(item => this.renderField(item))}
      </div>
		`
	}
	
	renderField(field) {
		const isAlwaysVisible = field.visibility === FIELD_VISIBILITY_ENUM.ALWAYS
		
		if (isAlwaysVisible) {
			return this.renderFieldType(field)
		} else {
			const isFieldVisible = conditionChecker(field.visibility, this.formData)
			
			return isFieldVisible ? html`${this.renderFieldType(field)}` : ''
		}
	}
	
	renderFieldType(field) {
		switch (field.type) {
			case 'text' :
				return html`
        <lion-input
                class="form-field"
                name=${field.name}
                label=${field.name}
                .validators=${field.validators}
                .modelValue="${this.formData[field.name] || ''}"
                @model-value-changed="${(e) => this.handleFieldChange(field.name, e.target.value)}"
        ></lion-input>
				`
			case 'number' :
				return html`
        <lion-input
                type="number"
                class="form-field"
                name=${field.name}
                label=${field.name}
                .validators=${field.validators}
                .parser="${viewValue => Number(viewValue)}"
                .modelValue="${this.formData[field.name] || 0}"
                @model-value-changed="${(e) => this.handleFieldChange(field.name, Number(e.target.value))}"
        ></lion-input>
				`
			case 'select' :
				return html`
        <lion-select
                class="form-field"
                name=${field.name}
                label=${field.name}
                .validators=${field.validators}
                .modelValue="${this.formData[field.name] || ''}"
                @model-value-changed="${(e) => this.handleFieldChange(field.name, e.target.value)}"
        >
            <select slot="input">
                ${field.dataset.map(item => html`
                    <option value=${item}>${item}</option>`)}
            </select>
        </lion-select>
				`
			case 'textarea' :
				return html`
        <lion-textarea
                class="form-field"
                name=${field.name}
                label=${field.name}
                .validators=${field.validators}
                .modelValue="${this.formData[field.name] || ''}"
                @model-value-changed="${(e) => this.handleFieldChange(field.name, e.target.value)}"
                max-rows="4"
        ></lion-textarea>
				`
			case 'checkbox' :
				return html`
        <lion-checkbox-group .validators=${field.validators} name=${field.name}>
            <lion-checkbox
                    class="form-field"
                    label=${field.name}
                    .choiceValue="${this.formData[field.name] || false}"
                    @model-value-changed="${(e) => this.handleFieldChange(field.name, e.target.modelValue.checked)}"
            ></lion-checkbox>
        </lion-checkbox-group>
				`
			case 'checkbox-group' :
				return html`
        <lion-checkbox-group
                class="form-field"
                name=${field.name}
                label=${field.name}
                .validators=${field.validators}
                .choiceValue="${this.formData[field.name] || []}"
                @model-value-changed="${(e) => this.handleFieldChange(field.name, e.target.modelValue)}"
        >
            ${field.dataset.map(item => html`
                <lion-checkbox label=${item} .choiceValue=${item}></lion-checkbox>
            `)}
        </lion-checkbox-group>
				`
			case 'radio-group' :
				return html`
        <lion-radio-group
                class="form-field"
                name=${field.name}
                label=${field.name}
                .modelValue="${this.formData[field.name] || []}"
                .validators=${field.validators}
                @model-value-changed="${(e) => this.handleFieldChange(field.name, e.target.modelValue)}"
        >
            ${field.dataset.map(item => html`
                <lion-radio label=${item} .choiceValue=${item}></lion-radio>
            `)}
        </lion-radio-group>
				`
			
			default:
				return html`<p>Brak zdefinowanego pola.</p>`
		}
	}
	
	renderValidationError() {
		return this.error ? html`
      <p class="status error">${this.error}</p>` : html``
	}
	
	renderSavingStatus() {
		const styleClass = `status ${this.savingStatus.status === 'success' ? 'success' : 'error'}`
		
		return this.savingStatus.message ? html`
      <div class=${styleClass}>${this.savingStatus.message}</div>` : html``
	}
	
	handleFieldChange(fieldName, value) {
		return this.formData = {...this.formData, [fieldName]: value};
	}
	
	handleSave(e) {
		e.preventDefault();
		
		const isFormValid = e.target.hasFeedbackFor.includes('error')
		
		if (!isFormValid) {
			const form = e.target
			this.error = ''
			
			return this.sendFormData(form.serializedValue)
		}
		
		const formElements = e.target.formElements
		
		const fieldsWithError = formElements
			.filter(el => el.hasFeedbackFor.includes('error'))
			.map(el => el.name);
		
		const pagesWithErrors = this.data
			.filter(step => step.form.some(field => fieldsWithError.includes(field.name)))
			.map(step => step.order);
		
		return this.error = `Wymagana jest poprawa pól na stronie: (${pagesWithErrors.map(page => page)})`
	}
	
	async sendFormData(formData) {
		try {
			const apiUrl = 'http://localhost:3000/api/send-form';
			await fetch(apiUrl, {
				method: 'POST', body: JSON.stringify(formData), headers: {'Content-Type': 'application/json'}
			});
			
			this.savingStatus = {status: 'success', message: 'Zapisano formularz'};
		} catch {
			this.savingStatus = {status: 'error', message: 'Zapis nie powiódł się'};
		}
	}
}

window.customElements.define('form-generator-subapp', FormGeneratorSubapp);
