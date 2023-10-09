import { createServer } from 'node:http';
import {
  type Request,
  type RouteMethod,
  extractPayload,
  findMatchingRoute,
  prepareRoutesHandler,
} from '~/core/mod';
import { ClientError } from '~/errors/client-error';
import { FatalError } from '~/errors/fatal-error';
import { MethodNotAllowedError } from '~/errors/method-not-allowed-error';
import { log } from '~/libs/log';

export async function server() {
  const port = parseInt(process.env.PORT ?? '3000', 10);
  const host = process.env?.HOST;
  const httpServer = createServer();
  const router = await prepareRoutesHandler();

  httpServer.on('request', async (_request, _response) => {
    log.info(_request.method!, _request.url);

    try {
      if (!_request?.method) {
        throw new ClientError('Http method should be attached');
      }

      const payload = extractPayload(_request);
      const method = _request.method.toLowerCase()!;
      const { endPoint, params }: ExtractedRouterObject = findMatchingRoute(
        router,
        _request.url!,
      );
      const modules = router.get(endPoint);

      // @ts-ignore
      const func = modules[method];

      // If route doesn't have a method to handle request
      if (!func) {
        throw new MethodNotAllowedError(
          `A request made for a resource that not support ${method.toUpperCase()} method`,
        );
      }

      const result = await (func as RouteMethod)(
        { ..._request, params, payload: await payload } as Request,
        _response,
      );

      if (!(result instanceof Response)) {
        throw new FatalError('Return value must be instance of Response');
      }

      const body = result.json().catch(error => {
        log.error('Return Type Error', error);
        throw new FatalError(error.message as string);
      });

      for (const [headerKey, headerValue] of result.headers) {
        _response.setHeader(headerKey, headerValue);
      }

      _response.statusCode = result.status;

      const response: ResponseStruct = {
        status: 'success',
        statusCode: result.status,
        data: await body,
      };

      _response.end(JSON.stringify(response));
    } catch (error) {
      if (error instanceof FatalError || !('statusCode' in (error as Error))) {
        log.error((error as Error).message, error);
        process.exit(1);
      }

      const statusCode = (error as ClientError).statusCode ?? 500;
      const { message } = error as ClientError;

      const response: ResponseStruct = {
        status: 'fail',
        statusCode,
        message,
      };

      _response.statusCode = statusCode;
      _response.setHeader('Content-type', 'application/json');
      _response.end(JSON.stringify(response));
    }
  });

  httpServer.listen(port, host);
  log.info('Listening to', `http://${host}:${port}`);
}
