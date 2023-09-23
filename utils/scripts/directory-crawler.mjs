import {sep} from 'node:path';
import {join, resolve} from 'node:path';
import {readdirSync} from 'node:fs';

/**
 *
 * @param {string} dir
 * @returns {Set<string>}
 */
export function directoryCrawler(dir) {
	dir = resolve(process.cwd(), dir);
	const file = new Set();
	const routerDirectory = String(dir.split(sep).at(-1));
	let currentPath = dir;

	const directoriesClimber = (searchPath = currentPath) => {
		const dir = readdirSync(searchPath, {
			encoding: 'utf-8',
			withFileTypes: true,
			recursive: true,
		});
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		const realtivePath =
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
