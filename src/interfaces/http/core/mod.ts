import { readdirSync } from 'fs';
import {
  type IncomingMessage as NodeIncomingMessage,
  type ServerResponse as NodeServerResponse,
} from 'http';
import { join, resolve } from 'path';
import {
  BodyInit,
  Response as NodeResponse,
  ResponseInit,
} from 'node-fetch-cjs';
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
  new: (body: BodyInit = {}, init?: ResponseInit): NodeResponse => {
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
  output_path: string,
): Promise<AppRouter> {
  const router = new Map<string, Record<Partial<HttpMethodKey>, RouterFunc>>();

  for (const route of directoryCrawler(output_path)) {
    if (!RegExp('.+route.js$').test(route)) continue;
    const module = require(resolve(route));
    const url =
      route
        .replace(/\\/g, '/')
        .replace(/.+api|(?<=.)route.js|(?<=.)\/(?=route\.js|$)/gm, '') || '/';

    router.set(url, module);
  }

  return router;

  function* directoryCrawler(dir: string): Generator<string> {
    const files = readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        yield* directoryCrawler(join(dir, file.name));
      } else {
        yield join(dir, file.name);
      }
    }
  }
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
export function searchForRoutesFile(dir: string): Set<string> {
  const routesFile = new Set<string>();

  for (const file of directoryCrawler(dir)) {
    if (!RegExp('.+route.ts$').test(file)) continue;

    routesFile.add(file);
  }

  return routesFile;

  function* directoryCrawler(dir: string): Generator<string> {
    const files = readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        yield* directoryCrawler(join(dir, file.name));
      } else {
        yield join(dir, file.name);
      }
    }
  }
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
