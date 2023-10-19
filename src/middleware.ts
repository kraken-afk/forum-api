import { ForbiddenError } from '~/commons/errors/forbidden-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import { type Request, type ServerResponse } from '~/infrastructure/core/mod';
import { authentications } from '~/modules/models/authentications-model';
import { jwt } from '~/modules/security/jwt';

const excludedRoute = ['/', '/users', '/authentications'];

export default async function (
  req: Request,
  _res: ServerResponse,
  next: CallableFunction,
) {
  if (excludedRoute.includes(req.url!)) return await next();
  const auth = req.headers?.authorization;

  if (!auth) throw new UnauthorizedError('Missing authentication');
  const [_authType, accessToken] = auth.split(' ');

  if (
    !(await authentications.isAccessTokenExist(accessToken)) &&
    !(await jwt.verifyToken(accessToken, process.env.ACCESS_TOKEN_KEY!))
  )
    throw new ForbiddenError('Invalid access token ');

  const token = jwt.unpack(accessToken) as Record<string, unknown>;
  const now = Date.now();

  if (now > (token?.exp as number))
    throw new ForbiddenError('Token has been expired');

  return await next();
}
