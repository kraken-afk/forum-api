import { ForbiddenError } from '~/commons/errors/forbidden-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import { controller } from '~/interfaces/http/core/controller';
import {
  type Request,
  RouterFunc,
  type ServerResponse,
} from '~/interfaces/http/core/mod';
import { authentications } from '~/modules/models/authentications-model';
import { jwt } from '~/modules/security/jwt';

export type TPublicRoutes = Record<string, Array<HttpMethodKey | '*'>>;

const publicRoutes: TPublicRoutes = {
  '/': ['GET', 'POST'],
  '/users': ['*'],
  '/authentications': ['*'],
  '/threads/[threadId]': ['GET'],
  '/threads/[threadId]/comments': ['GET'],
};

export default async function (
  req: Request,
  res: ServerResponse,
  next: RouterFunc,
) {
  let isPublicUrl = false;

  for (const [route, method] of Object.entries(publicRoutes)) {
    const control = controller(route, req.url!);

    if (
      (control.status !== 'FALSE' && method.includes('*')) ||
      method.includes(req.method as HttpMethodKey)
    ) {
      isPublicUrl = true;
      break;
    }
  }

  if (isPublicUrl) return await next(req, res);
  const auth = req.headers?.authorization;

  if (!auth) throw new UnauthorizedError('Missing authentication');
  const [_authType, accessToken] = auth.split(' ');

  if (
    !(await authentications.isAccessTokenExist(accessToken)) &&
    !jwt.verifyToken(accessToken, process.env.ACCESS_TOKEN_KEY!)
  )
    throw new ForbiddenError('Invalid access token ');

  const token = jwt.unpack(accessToken) as Record<string, unknown>;
  const now = Date.now();

  if (now > (token?.exp as number))
    throw new ForbiddenError('Token has been expired');

  return await next(req, res);
}
