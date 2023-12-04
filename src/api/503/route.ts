import { ServiceUnavailable } from '~/commons/errors/service-unavailable';
import type { Request, ServerResponse } from '~/interfaces/http/core/mod';

export function GET(_: Request, res: ServerResponse) {
  res.setHeader('Retry-After', 60);
  throw new ServiceUnavailable(
    'Oops, seems we had a lot of request, be patience and try again after 60s.',
  );
}
