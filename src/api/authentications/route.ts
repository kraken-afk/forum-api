import { type JwtPayload } from 'jsonwebtoken';
import { ClientError } from '~/commons/errors/client-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import type { Request } from '~/infrastructure/core/mod';
import { Send } from '~/infrastructure/core/mod';
import { authentications } from '~/modules/models/authentications-model';
import { users } from '~/modules/models/users-model';
import { jwt } from '~/modules/security/jwt';
import { loginPayloadValidator } from '~/modules/validators/login-payload-validator';

export async function POST(req: Request) {
  const payload = JSON.parse(req.payload) as LoginPayload;

  loginPayloadValidator(payload);

  if (!(await users.isUsernameExist(payload.username)))
    throw new ClientError(`username of ${payload.username} didn't exist`);

  if (
    !(await users.isPasswordAndUsernameMatch(
      payload.username,
      payload.password,
    ))
  )
    throw new UnauthorizedError('Unauthorized');

  const accessToken = jwt.createAccessToken({
    username: payload.username,
    exp: Date.now() + parseInt(process.env.ACCCESS_TOKEN_AGE!) * 60 * 60, // 3 hours expire time,
  });
  const refreshToken = jwt.createRefreshToken({
    username: payload.username,
  });

  authentications.insert(accessToken, refreshToken);

  return Send.new({ accessToken, refreshToken }, { status: 201 });
}

export async function PUT(req: Request) {
  const payload = JSON.parse(req.payload) as RefreshTokenPayload;

  if (!payload.refreshToken || typeof payload.refreshToken !== 'string')
    throw new ClientError('refreshToken must be a string');

  if (!jwt.verifyToken(payload.refreshToken, process.env.REFRESH_TOKEN_KEY!))
    throw new ClientError('refresh token tidak valid');

  if (!(await authentications.isRefreshTokenExist(payload.refreshToken)))
    throw new ClientError('refresh token tidak ditemukan di database');

  const jwtPayload = jwt.unpack(payload.refreshToken) as JwtPayload;

  const accessToken = jwt.createAccessToken({
    username: jwtPayload.username,
    exp: Date.now() + parseInt(process.env.ACCCESS_TOKEN_AGE!),
  });

  authentications.updateToken(accessToken, payload.refreshToken);

  return Send.new({ accessToken }, { status: 200 });
}

export async function DELETE(req: Request) {
  const payload = JSON.parse(req.payload) as RefreshTokenPayload;

  if (!payload.refreshToken || typeof payload.refreshToken !== 'string')
    throw new ClientError('refreshToken must be a string');

  if (!(await authentications.isRefreshTokenExist(payload.refreshToken)))
    throw new ClientError('refresh token tidak ditemukan di database');

  authentications.deleteToken(payload.refreshToken);

  return Send.new();
}
