import { JwtRepository } from '~/infrastructure/repository/jwt-repository';

process.env.ACCESS_TOKEN_KEY = 'secret_access_token';
process.env.REFRESH_TOKEN_KEY = 'secret_refresh_token';
const date = new Date();

describe('Jwt repository test suite', () => {
  test('Create access token test case with default expire time (1 hour)', () => {
    const jwt = new JwtRepository();
    const accessToken = jwt.createAccessToken({ username: 'jhon' });

    expect(typeof accessToken).toBe('string');
  });

  test('Create access token test case with given expire time', () => {
    const jwt = new JwtRepository();
    const accessToken = jwt.createAccessToken({
      username: 'jhon',
      exp: date.getTime() + 3000 * 60,
    });

    expect(typeof accessToken).toBe('string');
  });

  test('Create refresh token test case with default expire time (1 hour)', () => {
    const jwt = new JwtRepository();
    const refreshToken = jwt.createRefreshToken({
      username: 'jhon',
      exp: date.getTime() + 3000 * 60,
    });

    expect(typeof refreshToken).toBe('string');
  });

  test('Verify token test case', () => {
    const jwt = new JwtRepository();
    const accesToken = jwt.createAccessToken({ username: 'jhon' });
    const refreshToken = jwt.createRefreshToken({ username: 'jhon' });

    expect(jwt.verifyToken(refreshToken, jwt.REFRESH_TOKEN_KEY)).toBe(true);
    expect(jwt.verifyToken(accesToken, jwt.ACCESS_TOKEN_KEY)).toBe(true);

    expect(jwt.verifyToken(accesToken, jwt.REFRESH_TOKEN_KEY)).toBe(false);
  });

  test('Unpack token test case', () => {
    const jwt = new JwtRepository();
    const accessToken = jwt.createAccessToken({ username: 'jhon' });
    const unpackedToken = jwt.unpack(accessToken);

    expect(unpackedToken).toHaveProperty('username', 'jhon');
  });
});
