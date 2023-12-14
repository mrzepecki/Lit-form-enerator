import {CONDITIONS_CHECKER_ENUM} from "../enums/conditionsCheckerEnum.js";

export const conditionChecker = (condition, formData) => {
	const [fieldName, operator, rawValue] = condition.split(' ');
	const value = rawValue.toLowerCase() === 'true'
		? true
		: rawValue.toLowerCase() === 'false'
			? false
			: rawValue;

	if (!(fieldName && operator && value)) {
		throw new Error(`Wrong condition passed: ${condition}`);
	}

	switch (operator) {
		case CONDITIONS_CHECKER_ENUM.EQUAL:
			return formData[fieldName] === value;
		case CONDITIONS_CHECKER_ENUM.NOT_EQUAL:
			return formData[fieldName] !== value;

		default:
			new Error(`Unkown operator: ${condition}`);
			return false;
	}
}