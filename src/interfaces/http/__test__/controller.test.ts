import { controller } from '~/interfaces/http/core/controller';

describe('Extract router url function test case', () => {
  const TRUE = 'TRUE';
  const FALSE = 'FALSE';
  const PARAMS = 'PARAMS';

  const routeOne = '/user/[userId]';
  const routeTwo = '/user/[userId]/post/[postId]';

  const urlOne = '/user/123';
  const urlTwo = '/user/123/post/456';

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
    const urlOneWithSearchParams = '/user/123?name=Romeo&age=19';
    const r = controller(routeOne, urlOneWithSearchParams);

    expect(r).toHaveProperty('endPoint', routeOne);
    expect(r).toHaveProperty('status', PARAMS);

    expect(r).toHaveProperty('params');
    expect(r.params?.userId).toBe('123');

    expect(typeof r.params?.name).toBe('string');
    expect(typeof r.params?.age).toBe('number');

    expect(r.params?.name).toBe('Romeo');
    expect(r.params?.age).toBe(19);
  });

  test('Status of router should be FALSE (1)', () => {
    const r = controller('/user/settings', '/error');

    expect(r).toHaveProperty('status', FALSE);
  });

  test('Status of router should be FALSE (2)', () => {
    const r = controller('/user', '/error/test');

    expect(r).toHaveProperty('status', FALSE);
  });
});
