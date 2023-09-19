import {readdirSync} from 'node:fs';
import {resolve, sep} from 'node:path';
import {join} from 'node:path/posix';
import {_eval} from '~/libs/_eval';

export async function prepareRoutesHandler(): Promise<
	Map<string, Record<Partial<HttpMethodKey>, RouterFunc>>
> {
	const apiPath = resolve(process.cwd(), 'src/api/');
	const router = new Map<string, Record<Partial<HttpMethodKey>, RouterFunc>>();
	const routeList = searchForRoutesFile(apiPath);

	for (const route of routeList.values()) {
		if (route) {
			const modPath = resolve(apiPath, ...route.split('/'));
			// eslint-disable-next-line no-await-in-loop
			const module = await _eval<RouterFunc>(modPath);
			router.set(route.replace('/route.ts', '') || '/', module);
		}
	}

	return router;
}

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
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		const realtivePath = searchPath.split(routerDirectory).at(-1)?.replace(/\\/g, '/') || '/';

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
