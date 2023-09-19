import {describe, expect, test} from 'vitest';
import {searchForRoutesFile} from '~/core/mod';
import {resolve} from 'path';

describe('Search for router files test case', () => {
	const route: Set<String> = searchForRoutesFile(resolve(__dirname, 'mock/directory-mock'));

	test('Should be type of Set', () => {
		expect(route).toBeInstanceOf(Set);
	});

	test('Should have 2 length', () => {
		expect(route.size).toEqual(2);
	});

	test('Each item should include name route.ts', () => {
		route.forEach((item) => {
			expect(item.includes('route.ts')).toBe(true);
		});
	});
});
