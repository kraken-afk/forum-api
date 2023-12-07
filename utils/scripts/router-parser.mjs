import { join, resolve } from 'node:path';
import { build } from 'esbuild';
import { directoryCrawler } from './directory-crawler.mjs';

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

  for (const file of directoryCrawler(routerPath)) {
    if (!RegExp('.+route.ts$').test(file)) continue;
    targetPath.add(file);
  }

  const opt = {
    ...options,
    entryPoints: [...targetPath],
    outdir: join(outdir, 'api'),
  };

  await build(opt);
}
