import { Jwt } from '~/domains/security/jwt';
import { IJwt } from '~/infrastructure/contracts/T-jwt';

describe('Jwt domain test suite', () => {
  test('Create access token test case', () => {
    const MockedJwtRepository = <jest.Mock<IJwt>>jest.fn(() => ({
      createAccessToken(payload) {
        return JSON.stringify(payload);
      },
    }));
    const jwt = new Jwt(new MockedJwtRepository());
    const accessToken = jwt.createAccessToken({ username: 'jhon', exp: 3000 });

    expect(typeof accessToken).toBe('string');
  });

  test('Create refresh token test case', () => {
    const MockedJwtRepository = <jest.Mock<IJwt>>jest.fn(() => ({
      createRefreshToken(payload) {
        return JSON.stringify(payload);
      },
    }));
    const jwt = new Jwt(new MockedJwtRepository());
    const refreshToken = jwt.createRefreshToken({
      username: 'jhon',
      exp: 3000,
    });

    expect(typeof refreshToken).toBe('string');
  });

  test('Verofy token test case', () => {
    const MockedJwtRepository = <jest.Mock<IJwt>>jest.fn(() => ({
      verifyToken(token, secret) {
        return token === secret;
      },
    }));
    const jwt = new Jwt(new MockedJwtRepository());

    expect(jwt.verifyToken('right_token', 'right_token')).toBe(true);
    expect(jwt.verifyToken('wrong_token', 'right_token')).toBe(false);
  });

  test('Unpack token test case', () => {
    const MockedJwtRepository = <jest.Mock<IJwt>>jest.fn(() => {
      const key = { key: 'this_is_key' };

      return {
        createAccessToken(payload) {
          return JSON.stringify(Object.assign(payload, key));
        },
        unpack(token) {
          return JSON.parse(token);
        },
      };
    });
    const jwt = new Jwt(new MockedJwtRepository());
    const accessToken = jwt.createAccessToken({ username: 'jhon', exp: 3000 });
    const unpackedToken = jwt.unpack(accessToken);

    expect(unpackedToken).toHaveProperty('username', 'jhon');
    expect(unpackedToken).toHaveProperty('exp', 3000);
    expect(unpackedToken).toHaveProperty('key', 'this_is_key');
  });
});
