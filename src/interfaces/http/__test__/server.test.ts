import { Server } from 'http';
import request from 'supertest';
import { server } from '~/interfaces/http/core/server';

describe('Http Server test suite', () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'time').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});

  test('Should return instance of Http.Server', async () => {
    const app = await server(
      'src/interfaces/http/__test__/api',
      '127.0.0.1',
      5050,
      async (_req, _res, next) => await next(_req, _res),
    );
    expect(app).toBeInstanceOf(Server);

    await app.close();
  });

  describe('Http method support', () => {
    test('Create user scenario with POST method test case', async () => {
      const name = 'Jhon doe';
      const app = await server(
        'src/interfaces/http/__test__/api',
        '127.0.0.1',
        5050,
        async (_req, _res, next) => await next(_req, _res),
      );

      return request(app)
        .post('/users')
        .send({ name })
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(201)
        .then(async response => {
          expect(response.body).toHaveProperty('status', 'success');
          expect(response.body).toHaveProperty('statusCode', 201);
          expect(response.body).toHaveProperty('data');
          expect(response.body?.data).toHaveProperty('id', 'xxx');
          expect(response.body?.data).toHaveProperty('name', name);

          await app.close();
        });
    });

    test('Create user but fail test case', async () => {
      const app = await server(
        'src/interfaces/http/__test__/api',
        '127.0.0.1',
        5050,
        async (_req, _res, next) => await next(_req, _res),
      );

      return request(app)
        .post('/users')
        .send({ age: 19 })
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(400)
        .then(async response => {
          expect(response.body).toHaveProperty('status', 'fail');
          expect(response.body).toHaveProperty('statusCode', 400);
          expect(response.body).toHaveProperty(
            'message',
            'Name must be specified',
          );

          await app.close();
        });
    });

    test('Send request with unsupported method', async () => {
      const app = await server(
        'src/interfaces/http/__test__/api',
        '127.0.0.1',
        5050,
        async (_req, _res, next) => await next(_req, _res),
      );

      return request(app)
        .put('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(405)
        .then(async response => {
          expect(response.body).toHaveProperty('status', 'fail');
          expect(response.body).toHaveProperty('statusCode', 405);
          expect(response.body).toHaveProperty(
            'message',
            'A request made for a resource that not support PUT method',
          );

          await app.close();
        });
    });

    test('Send request to nonexistence url', async () => {
      const app = await server(
        'src/interfaces/http/__test__/api',
        '127.0.0.1',
        5050,
        async (_req, _res, next) => await next(_req, _res),
      );

      return request(app)
        .get('/cosmic')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(404)
        .then(async response => {
          expect(response.body).toHaveProperty('status', 'fail');
          expect(response.body).toHaveProperty('statusCode', 404);
          expect(response.body).toHaveProperty('message', '404 Not Found');

          await app.close();
        });
    });
  });

  describe('Send request with parameter', () => {
    test('Get user with id scenario test case', async () => {
      const app = await server(
        'src/interfaces/http/__test__/api',
        '127.0.0.1',
        5050,
        async (_req, _res, next) => await next(_req, _res),
      );

      return request(app)
        .get('/users/xxx')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .then(async response => {
          expect(response.body).toHaveProperty('status', 'success');
          expect(response.body).toHaveProperty('statusCode', 200);
          expect(response.body).toHaveProperty('data');
          expect(response.body?.data).toHaveProperty('name', 'Romeo');
          expect(response.body?.data).toHaveProperty('age', 19);

          await app.close();
        });
    });

    test('Get unknown user with id scenario test case', async () => {
      const app = await server(
        'src/interfaces/http/__test__/api',
        '127.0.0.1',
        5050,
        async (_req, _res, next) => await next(_req, _res),
      );

      return request(app)
        .get('/users/123')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(404)
        .then(async response => {
          expect(response.body).toHaveProperty('status', 'fail');
          expect(response.body).toHaveProperty('statusCode', 404);
          expect(response.body).toHaveProperty('message', 'User not found');

          await app.close();
        });
    });
  });

  describe('Response test suite', () => {
    test('Should response with JSON', async () => {
      const app = await server(
        'src/interfaces/http/__test__/api',
        '127.0.0.1',
        5050,
        async (_req, _res, next) => await next(_req, _res),
      );

      return request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .then(async response => {
          expect(response.body).toHaveProperty('status', 'success');
          expect(response.body).toHaveProperty('statusCode', 200);
          expect(response.body).toHaveProperty('data');
          expect(response.body?.data).toHaveProperty('name', 'Romeo');
          expect(response.body?.data).toHaveProperty('age', 19);

          await app.close();
        });
    });

    test('Should get custom headers', async () => {
      const app = await server(
        'src/interfaces/http/__test__/api',
        '127.0.0.1',
        5050,
        async (_req, _res, next) => await next(_req, _res),
      );

      return request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect('X-custom', 'true')
        .expect(200)
        .then(async response => {
          expect(response.body).toHaveProperty('status', 'success');
          expect(response.body).toHaveProperty('statusCode', 200);
          expect(response.body).toHaveProperty('data');
          expect(response.body?.data).toHaveProperty('name', 'Romeo');
          expect(response.body?.data).toHaveProperty('age', 19);

          await app.close();
        });
    });

    test('Should throw FatalError because instance got server issue', async () => {
      const app = await server(
        'src/interfaces/http/__test__/api',
        '127.0.0.1',
        5050,
        async (_req, _res, next) => await next(_req, _res),
      );
      return request(app)
        .post('/users/xxx')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(500)
        .then(async response => {
          expect(response.body).toHaveProperty('status', 'fail');
          expect(response.body).toHaveProperty('statusCode', 500);
          expect(response.body).toHaveProperty(
            'message',
            "Operation couldn't resolve",
          );

          await app.close();
        });
    });

    test('Should throw FatalError because instance returning non-JSON format', async () => {
      const app = await server(
        'src/interfaces/http/__test__/api',
        '127.0.0.1',
        5050,
        async (_req, _res, next) => await next(_req, _res),
      );
      return request(app)
        .post('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(500)
        .then(async response => {
          expect(response.body).toHaveProperty('status', 'fail');
          expect(response.body).toHaveProperty('statusCode', 500);
          expect(response.body).toHaveProperty('message');

          await app.close();
        });
    });
  });
});
