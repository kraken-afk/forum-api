import { config } from 'dotenv';
import { describe, expect, test } from 'vitest';
import { Jwt } from '~/domains/security/jwt';
import { JwtRepository } from '~/infrastructure/repository/jwt-repository';

config();
const jwt = new Jwt(new JwtRepository());

describe('Jwt repository test suite', () => {
  test('Create access token', () => {
    const payload = createJwtPayload();
    const token = jwt.createAccessToken(payload);

    expect(token).toBeTypeOf('string');
  });

  test('Create refresh token', () => {
    const payload = createJwtPayload();
    const token = jwt.createRefreshToken(payload);

    expect(token).toBeTypeOf('string');
  });

  test('Unpack payload', () => {
    const payload: JwtPayload[] = [
      {
        username: 'Jhon',
      },
      {
        username: 'Christ',
      },
    ];

    const accessToken = jwt.createAccessToken(payload[0]);
    const refreshToken = jwt.createRefreshToken(payload[1]);

    expect(jwt.unpack(accessToken)).toHaveProperty(
      'username',
      payload[0].username,
    );
    expect(jwt.unpack(refreshToken)).toHaveProperty(
      'username',
      payload[1].username,
    );
  });
});

function createJwtPayload(): JwtPayload {
  return {
    username: 'Jhon doe',
  };
}
