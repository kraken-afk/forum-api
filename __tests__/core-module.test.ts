import {describe, expect, test} from 'vitest';
import {routeController, searchForRoutesFile} from '~/core/mod';
import {resolve} from 'path';

describe('Search for router files test case', () => {
	const route: Set<String> = searchForRoutesFile(
		resolve(__dirname, 'mock/directory-mock'),
	);

	console.log(route);

	test('Should be type of Set', () => {
		expect(route).toBeInstanceOf(Set);
	});

	test('Should have 2 length', () => {
		expect(route.size).toEqual(2);
	});

	test('Each item should include name route.ts', () => {
		route.forEach(item => {
			expect(item.includes('route.ts')).toBe(true);
		});
	});
});

describe('Extract router url function test case', () => {
	const TRUE = 'TRUE';
	const FALSE = 'FALSE';
	const PARAMS = 'PARAMS';

	const routeOne = '/user/[userId]';
	const routeTwo = '/user/[userId]/post/[postId]';

	const urlOne = '/user/123';
	const urlTwo = '/user/123/post/456';

	test('Router and url should match', () => {
		const r = routeController('/user', '/user');

		expect(r).toHaveProperty('endPoint', '/user');
		expect(r).toHaveProperty('status', TRUE);
	});

	test('Should return userId as params', () => {
		const r = routeController(routeOne, urlOne);

		expect(r).toHaveProperty('endPoint', routeOne);
		expect(r).toHaveProperty('status', PARAMS);

		expect(r).toHaveProperty('params');
		expect(r.params?.userId).toBe('123');
	});

	test('Should return userId and postId as params', () => {
		const r = routeController(routeTwo, urlTwo);

		expect(r).toHaveProperty('endPoint', routeTwo);
		expect(r).toHaveProperty('status', PARAMS);

		expect(r).toHaveProperty('params');
		expect(r.params?.userId).toBe('123');
		expect(r.params?.postId).toBe('456');
	});

	test('Status of router should be FALSE', () => {
		const r = routeController('/user', '/error');

		expect(r).toHaveProperty('status', FALSE);
	});
});