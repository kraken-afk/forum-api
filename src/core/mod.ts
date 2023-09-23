import {readdirSync} from 'node:fs';
import {resolve, sep} from 'node:path';
import {join} from 'node:path/posix';
import {pathToFileURL} from 'node:url';

const sourcePath = 'src/api';

export async function prepareRoutesHandler(): Promise<AppRouter> {
	const apiPath = resolve(process.cwd(), sourcePath);
	const router = new Map<string, Record<Partial<HttpMethodKey>, RouterFunc>>();
	const routeList = searchForRoutesFile(apiPath);

	for (const route of routeList.values()) {
		if (route) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
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
