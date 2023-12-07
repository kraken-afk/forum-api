import { createServer } from 'http';
import chalk from 'chalk';
import { Response as NodeResponse } from 'node-fetch-cjs';
import { ClientError } from '~/commons/errors/client-error';
import { FatalError } from '~/commons/errors/fatal-error';
import { MethodNotAllowedError } from '~/commons/errors/method-not-allowed-error';
import { NotFoundError } from '~/commons/errors/not-found-error';
import { log } from '~/commons/libs/log';
import {
  type Request,
  RouterFunc,
  ServerResponse,
  findMatchingRoute,
  prepareRoutesHandler,
} from '~/interfaces/http/core/mod';

export async function server(
  source_path: string,
  host: string,
  port: number,
  middleware: (
    req: Request,
    res: ServerResponse,
    next: RouterFunc,
  ) => Promise<NodeResponse>,
) {
  const httpServer = createServer();
  const router = await prepareRoutesHandler(source_path, __OUT_DIR__);

  httpServer.on('request', async (_request, _response) => {
    console.time('response time');
    log.log(_request.method!, chalk.blue(_request.url));

    try {
      const payload = new Promise(resolve => {
        let data = '';
        _request.on('data', chunk => {
          data += chunk;
        });
        _request.on('end', () => resolve(data));
      });

      const method = _request.method as HttpMethodKey;
      const r = findMatchingRoute(router, _request.url!);

      if (!r) throw new NotFoundError('404 Not Found');

      const modules = router.get(r.endPoint)!;

      // If route doesn't have a method to handle request
      if (!modules[method]) {
        throw new MethodNotAllowedError(
          `A request made for a resource that not support ${method} method`,
        );
      }

      const request = Object.assign(_request, {
        params: r.params,
        payload: await payload,
      }) as Request;
      // @ts-ignore
      const result = await middleware(request, _response, async () => {
        return modules[method](request, _response);
      });

      const body = (result as NodeResponse).json();

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
      if (error instanceof FatalError || !(error as ClientError)?.statusCode)
        log.error('FATAL_ERROR', error);

      const statusCode = (error as ClientError)?.statusCode ?? 500;
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
    console.timeEnd('response time');
    console.log('\n');
  });

  httpServer.listen(port, host);

  log.info('Listening to', `http://${host}:${port}`);

  return httpServer;
}
