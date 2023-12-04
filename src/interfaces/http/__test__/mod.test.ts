import { resolve } from 'path';
import { Response } from 'node-fetch-cjs';
import { NotFoundError } from '~/commons/errors/not-found-error';
import {
  Send,
  findMatchingRoute,
  prepareRoutesHandler,
  searchForRoutesFile,
} from '~/interfaces/http/core/mod';

describe('Search for router files test suite', () => {
  const route: Set<string> = searchForRoutesFile(resolve(__dirname, 'api'));

  test('Should be type of Set', () => {
    expect(route).toBeInstanceOf(Set);
  });

  test('Should have 2 length', () => {
    expect(route.size).toEqual(3);
  });

  test('Each item should include name route.ts', () => {
    for (const item of route) {
      expect(item.includes('route.ts')).toBe(true);
    }
  });
});

describe('Send::new module test suite', () => {
  test('Should be instance of Response from node-fetch', () => {
    const response = Send.new();

    expect(response).toBeInstanceOf(Response);
  });

  test('Set body with Object', async () => {
    const rawResponse = Send.new({ name: 'Romeo', age: 19 });
    const data = await rawResponse.json();

    expect(data).toHaveProperty('name', 'Romeo');
    expect(data).toHaveProperty('age', 19);
  });

  test('Set body with string', async () => {
    const rawResponse = Send.new('lorem ipsum');
    const data = await rawResponse.text();

    expect(data).toBe('lorem ipsum');
  });

  test('Should have headers', () => {
    const rawResponse = Send.new(
      {},
      { headers: { 'X-custom-header': 'lorem ipsum.' } },
    );

    expect(rawResponse.headers.has('X-custom-header')).toBeTruthy();
    expect(rawResponse.headers.get('X-custom-header')).toBe('lorem ipsum.');
  });

  test('Should has Content-Type: application/json as default header', () => {
    const rawResponse = Send.new({});

    expect(rawResponse.headers.has('Content-Type')).toBeTruthy();
    expect(rawResponse.headers.get('Content-Type')).toBe('application/json');
  });
});

describe('Get route file handler test suite', () => {
  test('Should instance of Map', async () => {
    const appRouter = await prepareRoutesHandler(
      'src/interfaces/http/__test__/api',
      'src/interfaces/http/__test__/',
    );

    expect(appRouter).toBeInstanceOf(Map);
  });

  test('Should have route key', async () => {
    const appRouter = await prepareRoutesHandler(
      'src/interfaces/http/__test__/api',
      'src/interfaces/http/__test__/',
    );

    expect(appRouter.has('/')).toBeTruthy();
    expect(appRouter.has('/users')).toBeTruthy();
  });
});

describe('Route matcher test suite', () => {
  test('Route should match', async () => {
    const appRouter = await prepareRoutesHandler(
      'src/interfaces/http/__test__/api',
      'src/interfaces/http/__test__/',
    );
    const r = findMatchingRoute(appRouter, '/users');

    expect(r).toHaveProperty('status', 'TRUE');
    expect(r).toHaveProperty('endPoint', '/users');
    expect(r).toHaveProperty('params');
  });

  test("Route shouldn't match", async () => {
    const appRouter = await prepareRoutesHandler(
      'src/interfaces/http/__test__/api',
      'src/interfaces/http/__test__/',
    );
    expect(() => findMatchingRoute(appRouter, '/cosmic')).toThrow(
      NotFoundError,
    );
  });

  test('Route should have params', async () => {
    const appRouter = await prepareRoutesHandler(
      'src/interfaces/http/__test__/api',
      'src/interfaces/http/__test__/',
    );
    const r = findMatchingRoute(appRouter, '/users/123');

    expect(r).toHaveProperty('status', 'PARAMS');
    expect(r).toHaveProperty('endPoint', '/users/[userId]');
    expect(r).toHaveProperty('params');
    expect(r.params.userId).toBe('123');
  });
});
