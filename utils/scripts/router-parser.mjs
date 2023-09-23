import {join, resolve} from 'node:path';
import {directoryCrawler} from './directory-crawler.mjs';
import {build} from 'esbuild';

/**
 *
 * @param {string} dir
 * @param {string} outdir
 * @param {import("esbuild").BuildOptions} options
 */
export async function routerParser(dir, outdir, options) {
	const cwd = process.cwd();
	const routerPath = resolve(cwd, dir.replace(/\/$/, ''));
	/**
	 * @type {Set<string, string}
	 */
	const targetPath = new Set();

	for (const target of directoryCrawler(routerPath)) {
		const path = join(routerPath, target);
		targetPath.add(path);
	}

	const opt = {
		...options,
		entryPoints: [...targetPath],
		outdir: join(outdir, 'api'),
	};

	await build(opt);
}
