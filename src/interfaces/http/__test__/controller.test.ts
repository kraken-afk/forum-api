import { controller } from '~/interfaces/http/core/controller';

describe('Extract router url function test case', () => {
  const routeOne = '/user/[userId]';
  const routeTwo = '/user/[userId]/post/[postId]';

  const urlOne = '/user/123';
  const urlTwo = '/user/123/post/456';

  test('Router and url should match', () => {
    const r = controller('/user', '/user');

    expect(r).toHaveProperty('endpoint', '/user');
    expect(r).toHaveProperty('status', true);
  });

  test('Should return userId as params', () => {
    const r = controller(routeOne, urlOne);

    expect(r).toHaveProperty('endpoint', routeOne);
    expect(r).toHaveProperty('status', true);

    expect(r).toHaveProperty('params');
    expect(r.params?.userId).toBe('123');
  });

  test('Should return userId and postId as params', () => {
    const r = controller(routeTwo, urlTwo);

    expect(r).toHaveProperty('endpoint', routeTwo);
    expect(r).toHaveProperty('status', true);

    expect(r).toHaveProperty('params');
    expect(r.params?.userId).toBe('123');
    expect(r.params?.postId).toBe('456');
  });

  test('Should return userId, name, and age as params', () => {
    const urlOneWithSearchParams = '/user/123?name=Romeo&age=19';
    const r = controller(routeOne, urlOneWithSearchParams);

    expect(r).toHaveProperty('endpoint', routeOne);
    expect(r).toHaveProperty('status', true);

    expect(r).toHaveProperty('params');
    expect(r.params?.userId).toBe('123');

    expect(typeof r.params?.name).toBe('string');
    expect(typeof r.params?.age).toBe('string');

    expect(r.params?.name).toBe('Romeo');
    expect(r.params?.age).toBe('19');
  });

  test('Status of router should be false (1)', () => {
    const r = controller('/user/settings', '/error');

    expect(r).toHaveProperty('status', false);
  });

  test('Status of router should be false (2)', () => {
    const r = controller('/user', '/error/test');

    expect(r).toHaveProperty('status', false);
  });

  test('Status of router should be false (3)', () => {
    const r = controller('/user/romeo', '/user/test?id=123');

    expect(r).toHaveProperty('status', false);
  });
});
