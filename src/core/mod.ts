import {readdirSync} from 'node:fs';
import {resolve, sep} from 'node:path';
import {join} from 'node:path/posix';
import {pathToFileURL} from 'node:url';

const sourcePath = 'src/api';

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
	const apiPath = resolve(process.cwd(), sourcePath);
	const router = new Map<string, Record<Partial<HttpMethodKey>, RouterFunc>>();
	const routeList = searchForRoutesFile(apiPath);

	for (const route of routeList.values()) {
		if (route) {
			const targetDir = resolve(join(...__OUT_DIR__.split('/'), 'api'));
			const targetRoute = route.replace(/ts$/, 'js').split('/');
			const modPath = resolve(targetDir, ...targetRoute);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-await-in-loop
			const module = await import(pathToFileURL(modPath).toString());
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
 * @param {string} dir
 */
export function searchForRoutesFile(dir: string): Set<string> {
	dir = resolve(process.cwd(), dir);
	const file = new Set<string>();
	const routerDirectory = String(dir.split(sep).at(-1));
	let currentPath = dir;

	const directoriesClimber = (searchPath: string = currentPath) => {
		const dir = readdirSync(searchPath, {
			encoding: 'utf-8',
			withFileTypes: true,
			recursive: true,
		});
		// eslint-disable-next-line operator-linebreak
		const realtivePath =
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			searchPath.split(routerDirectory).at(-1)?.replace(/\\/g, '/') || '/';

		for (const f of dir) {
			if (f.name === 'route.ts') {
				file.add(join(realtivePath, f.name));
			}

			if (f.isDirectory()) {
				currentPath = resolve(currentPath, f.name);
				directoriesClimber(currentPath);
			}
		}

		return file;
	};

	return directoriesClimber();
}

/**
 * Matching url with routes and return status of route.
 * ```ts
 * return ({
 * 	endPoint: string;
 *		status: 'TRUE' | 'PARAMS' | 'FALSE';
 *		params: Record<string, string>;
 *	});
 * ```
 */
export function routeController(
	routeStr: string,
	urlStr: string,
): ExtractedRouterObject {
	const route = routeStr.split('/');
	const url = urlStr.split('/');
	const len = route.length > url.length ? route.length : url.length;
	const rgx = /\[.+\]/;
	const extractedRouterObject: ExtractedRouterObject = {
		endPoint: routeStr,
		status: 'TRUE',
		params: {},
	};

	for (let i = 0; i < len; i++) {
		const r = route[i];
		const u = url[i];

		if (r === u) {
			continue;
		} else if (rgx.test(r)) {
			const key = rgx.exec(r)![0].replace(/[[\]]/g, '');

			extractedRouterObject.status = 'PARAMS';
			extractedRouterObject.params[key] = u;
		} else {
			extractedRouterObject.status = 'FALSE';
			break;
		}
	}

	return extractedRouterObject;
}
