import { readdirSync } from 'node:fs';
import { sep } from 'node:path';
import { join, resolve } from 'node:path';

/**
 *
 * @param {string} relativeDir
 * @returns {Set<string>}
 */
export function directoryCrawler(relativeDir) {
  const directory = resolve(process.cwd(), relativeDir);
  const file = new Set();
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

  const directoriesClimber = (searchPath = currentPath) => {
    const dir = readdirSync(searchPath, {
      encoding: 'utf-8',
      withFileTypes: true,
    });

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const realtivePath =
      searchPath
        .split(routerDirectory)
        [searchPath.split(routerDirectory).length - 1].replace(/\\/g, '/') ||
      '/';

    for (const f of dir) {
      if (f.name === 'route.ts') {
        file.add(join(realtivePath, f.name));
      }

      if (f.isDirectory()) {
        if (parentDir.includes(f.name))
          currentPath = resolve(directory, f.name);
        else currentPath = resolve(currentPath, f.name);

        directoriesClimber(currentPath);
      }
    }

    return file;
  };

  return directoriesClimber();
}
