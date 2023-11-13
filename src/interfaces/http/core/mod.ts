import { readdirSync } from 'fs';
import {
  type IncomingMessage as NodeIncomingMessage,
  type ServerResponse as NodeServerResponse,
} from 'http';
import { resolve, sep } from 'path';
import { posix } from 'path';
import { pathToFileURL } from 'url';
import { Response as NodeResponse } from 'node-fetch-cjs';
import { NotFoundError } from '~/commons/errors/not-found-error';
import { controller } from '~/interfaces/http/core/controller';

/* MODULE */
export type Request = Prettify<
  NodeIncomingMessage & { params: Record<string, string>; payload: string }
>;
export type ServerResponse = Prettify<NodeServerResponse>;
export type RouteMethod = (req: Request, res: ServerResponse) => NodeResponse;

export const Send = {
  new: (
    body: Prettify<BodyInit | Record<string, unknown>> = {},
    headers?: ResponseInit,
  ): NodeResponse => {
    const _body = typeof body === 'string' ? body : JSON.stringify(body);
    const _headers =
      headers && 'Content-Type' in headers!
        ? headers
        : { ...headers, headers: { 'Content-Type': 'application/json' } };

    return new NodeResponse(_body, _headers);
  },
};

/**
 * Taking all router into memory with ```require() ```
 * and returning a Map with router path as keys
 * and all methods of router module as the values
 * ```ts
 * Map { '/user' => {get: Function} }
 * //******************************
 * Module {
 * 	post: Function;
 * 	get: Function;
 * 	delete: Function;
 * 	put: Function;
 * 	patch: Function;
 * }
 * ```
 */
export async function prepareRoutesHandler(
  source_path: string,
  output_path: string = __OUT_DIR__,
): Promise<AppRouter> {
  const apiPath = resolve(process.cwd(), source_path);
  const router = new Map<string, Record<Partial<HttpMethodKey>, RouterFunc>>();
  const routeList = searchForRoutesFile(apiPath);

  for (const route of routeList.values()) {
    if (route) {
      const targetDir = resolve(posix.join(...output_path.split('/'), 'api'));
      const targetRoute = route.replace(/ts$/, 'js').split('/');
      const modPath = resolve(targetDir, ...targetRoute);
      const module = await import(pathToFileURL(modPath).toString());

      router.set(route.replace('/route.ts', '') || '/', module);
    }
  }

  return router;
}

/**
 * Taking router directory as paramter
 * ```ts
 * searchForRoutesFile('src/app/routes')
 * ```
 * Returning a Set of route path
 * ```ts
 * return Set { '/user', '/user/[userId]' }
 * ```
 * Similiar with NextJs route system
 * @param {string} relativeDir
 */
export function searchForRoutesFile(relativeDir: string): Set<string> {
  const directory = resolve(process.cwd(), relativeDir);
  const file = new Set<string>();
  const parentDir = readdirSync(directory, {
    encoding: 'utf-8',
    withFileTypes: true,
  }).map(dirent => {
    if (dirent.isDirectory()) return dirent.name;
  });
  const routerDirectory = String(
    directory.split(sep)[directory.split(sep).length - 1],
  );
  let currentPath = directory;

  const findFileRecursive = (searchPath: string = currentPath) => {
    const dir = readdirSync(searchPath, {
      encoding: 'utf-8',
      withFileTypes: true,
    });
    const realtivePath =
      searchPath
        .split(routerDirectory)
        [searchPath.split(routerDirectory).length - 1].replace(/\\/g, '/') ||
      '/';

    for (const f of dir) {
      if (f.name === 'route.ts') {
        file.add(posix.join(realtivePath, f.name));
      }

      if (f.isDirectory()) {
        if (parentDir.includes(f.name))
          currentPath = resolve(directory, f.name);
        else currentPath = resolve(currentPath, f.name);

        findFileRecursive(currentPath);
      }
    }

    return file;
  };

  return findFileRecursive();
}

/**
 * Iterating all over possibly route path and find route that matched with url
 */
export function findMatchingRoute(
  router: AppRouter,
  url: string,
): ExtractedRouterObject {
  let extractedRouterObject: ExtractedRouterObject | undefined;

  for (const routePath of router.keys()) {
    const comparedRouter = controller(routePath, url);

    if (comparedRouter.status !== 'FALSE') {
      extractedRouterObject = comparedRouter;
      break;
    }
  }

  if (!extractedRouterObject) {
    throw new NotFoundError('404 Not Found');
  }

  return extractedRouterObject;
}

export function extractPayload(req: NodeIncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', err => reject(err));
  });
}
