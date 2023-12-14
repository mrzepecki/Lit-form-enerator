import {conditionChecker} from "./conditionChecker.js";

describe('conditionChecker', () => {

	test('Should return true for EQUAL condition when formData[fieldName] is equal to value', () => {
		const formData = { field: 'test' };
		const condition = 'field === test';
		const result = conditionChecker(condition, formData);

		expect(result).toBe(true);
	});

	test('Should return true for NOT EQUAL condition when formData[fieldName] is equal to value', () => {
		const formData = { field: 'test-niepoprawny' };
		const condition = 'field !== test';
		const result = conditionChecker(condition, formData);

		expect(result).toBe(true);
	});

	test('Should return true for EQUAL condition when formData[fieldName] is equal to value', () => {
		const formData = { field: 'test-niepoprawny' };
		const condition = 'field !== test';
		const result = conditionChecker(condition, formData);

		expect(result).toBe(true);
	});

	test('Should return error when passed condition is illegal', () => {
		const formData = { field1: 'test' };
		const condition = '!=';

		expect(() => conditionChecker(condition, formData)).toThrowError();
	});
});