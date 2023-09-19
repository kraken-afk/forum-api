import {beforeAll, expect, test} from 'vitest';
import {_eval} from '~/libs/_eval';
import {resolve} from 'path';
import {describe} from 'node:test';

describe('Should be able to import ts file dynamically', () => {
	let module: any;

	beforeAll(async () => {
		module = await _eval(resolve(__dirname, 'mock/sum.ts'));
	});

	test('Should have "sum" property', async () => {
		expect(module).haveOwnProperty('sum');
	});

	test('Type of sum must be a function', async () => {
		expect(module?.sum).toBeTypeOf('function');
	});

	test('Function should be work', async () => {
		expect(module?.sum(1, 2, 3)).toEqual(6);
	});
});
