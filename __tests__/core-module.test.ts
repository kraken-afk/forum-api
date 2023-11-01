import { resolve } from 'path';
import { controller } from '~/infrastructure/core/controller';
import { searchForRoutesFile } from '~/infrastructure/core/mod';

describe('Search for router files test case', () => {
  const route: Set<string> = searchForRoutesFile(
    resolve(__dirname, 'mock/directory-mock'),
  );

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

describe('Extract router url function test case', () => {
  const TRUE = 'TRUE';
  const FALSE = 'FALSE';
  const PARAMS = 'PARAMS';

  const routeOne = '/user/[userId]';
  const routeTwo = '/user/[userId]/post/[postId]';

  const urlOne = '/user/123';
  const urlTwo = '/user/123/post/456';

  const urlOneWithSearchParams = '/user/123?name=Romeo&age=18';

  test('Router and url should match', () => {
    const r = controller('/user', '/user');

    expect(r).toHaveProperty('endPoint', '/user');
    expect(r).toHaveProperty('status', TRUE);
  });

  test('Should return userId as params', () => {
    const r = controller(routeOne, urlOne);

    expect(r).toHaveProperty('endPoint', routeOne);
    expect(r).toHaveProperty('status', PARAMS);

    expect(r).toHaveProperty('params');
    expect(r.params?.userId).toBe('123');
  });

  test('Should return userId and postId as params', () => {
    const r = controller(routeTwo, urlTwo);

    expect(r).toHaveProperty('endPoint', routeTwo);
    expect(r).toHaveProperty('status', PARAMS);

    expect(r).toHaveProperty('params');
    expect(r.params?.userId).toBe('123');
    expect(r.params?.postId).toBe('456');
  });

  test('Should return userId, name, and age as params', () => {
    const r = controller(routeOne, urlOneWithSearchParams);

    expect(r).toHaveProperty('endPoint', routeOne);
    expect(r).toHaveProperty('status', PARAMS);

    expect(r).toHaveProperty('params');
    expect(r.params?.userId).toBe('123');

    expect(typeof r.params?.name).toBe('string');
    expect(typeof r.params?.age).toBe('number');

    expect(r.params?.name).toBe('Romeo');
    expect(r.params?.age).toBe(18);
  });

  test('Status of router should be FALSE', () => {
    const r = controller('/user', '/error');

    expect(r).toHaveProperty('status', FALSE);
  });
});
