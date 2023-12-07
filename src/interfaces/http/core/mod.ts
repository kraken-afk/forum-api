import { readdirSync } from 'fs';
import {
  type IncomingMessage as NodeIncomingMessage,
  type ServerResponse as NodeServerResponse,
} from 'http';
import { join, resolve, sep } from 'path';
import { posix } from 'path';
import { Response as NodeResponse } from 'node-fetch-cjs';
import { controller } from '~/interfaces/http/core/controller';

/* MODULE */
export type Request = NodeIncomingMessage & {
  params: Record<string, string>;
  payload: string;
};
export type ServerResponse = Prettify<NodeServerResponse>;
export type RouteMethod = (req: Request, res: ServerResponse) => NodeResponse;
export type RouterFunc = (
  request: Request,
  response: ServerResponse,
) => NodeResponse;

export const Send = {
  new: (
    body: Prettify<BodyInit | Record<string, unknown>> = {},
    init?: ResponseInit,
  ): NodeResponse => {
    const _body = typeof body === 'string' ? body : JSON.stringify(body);
    const _init: ResponseInit =
      init !== undefined
        ? {
            ...init,
            headers: { 'Content-Type': 'application/json', ...init?.headers },
          }
        : {
            headers: { 'Content-Type': 'application/json' },
          };

    return new NodeResponse(_body, _init);
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
  output_path: string,
): Promise<AppRouter> {
  const apiPath = resolve(process.cwd(), source_path);
  const router = new Map<string, Record<Partial<HttpMethodKey>, RouterFunc>>();
  const routeList = searchForRoutesFile(apiPath);

  for (const route of routeList) {
    const targetDir = resolve(output_path, 'api');
    const targetRoute = route.replace(/ts$/, 'js');
    const modPath = join(targetDir, targetRoute);
    const module = require(modPath);

    router.set(route.replace('/route.ts', '') || '/', module);
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
): ExtractedRouterObject | undefined {
  let extractedRouterObject: ExtractedRouterObject | undefined;

  for (const routePath of router.keys()) {
    const comparedRouter = controller(routePath, url);

    if (comparedRouter.status !== 'FALSE') {
      extractedRouterObject = comparedRouter;
      break;
    }
  }

  return extractedRouterObject;
}
