import { readdirSync } from 'node:fs';
import {
  type IncomingMessage as NodeIncomingMessage,
  type ServerResponse as NodeServerResponse,
} from 'node:http';
import { resolve, sep } from 'node:path';
import { join } from 'node:path/posix';
import { pathToFileURL } from 'node:url';
import { controller } from '~/core/controller';
import { NotFoundError } from '~/errors/not-found-error';

/* MODULE */
export type Request = Prettify<
  NodeIncomingMessage & { params: Record<string, string>; payload: string }
>;
export type ServerResponse = Prettify<NodeServerResponse>;
export type RouteMethod = (req: Request, res: ServerResponse) => Response;

export const Send = {
  new: (
    body: Prettify<BodyInit | Record<string, unknown>> = {},
    headers?: ResponseInit,
  ): Response => {
    const _body = typeof body === 'string' ? body : JSON.stringify(body);
    const _headers =
      headers && 'Content-Type' in headers!
        ? headers
        : { ...headers, headers: { 'Content-Type': 'application/json' } };

    return new Response(_body, _headers) as Response;
  },
};

const SOURCE_PATH = 'src/api';

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
export async function prepareRoutesHandler(): Promise<AppRouter> {
  const apiPath = resolve(process.cwd(), SOURCE_PATH);
  const router = new Map<string, Record<Partial<HttpMethodKey>, RouterFunc>>();
  const routeList = searchForRoutesFile(apiPath);

  for (const route of routeList.values()) {
    if (route) {
      const targetDir = resolve(join(...__OUT_DIR__.split('/'), 'api'));
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
  const routerDirectory = String(directory.split(sep).at(-1));
  let currentPath = directory;

  const findFileRecursive = (searchPath: string = currentPath) => {
    const dir = readdirSync(searchPath, {
      encoding: 'utf-8',
      withFileTypes: true,
      recursive: true,
    });
    const realtivePath =
      searchPath.split(routerDirectory).at(-1)?.replace(/\\/g, '/') || '/';

    for (const f of dir) {
      if (f.name === 'route.ts') {
        file.add(join(realtivePath, f.name));
      }

      if (f.isDirectory()) {
        currentPath = resolve(directory, f.name);
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
