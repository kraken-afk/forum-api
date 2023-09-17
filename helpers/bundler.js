// @ts-check

import * as esbuild from 'esbuild';
import { readFile } from 'node:fs/promises';
import ora from 'ora';

/**
 *
 * @param {import('esbuild').BuildOptions} options
 */
export function bundler(options) {
  const spinner = ora();

  return {
    async build() {
      const start = Date.now();

      spinner.color = 'yellow';
      spinner.start('Eating esbuild.json ...');

      try {
        const optJson = await readFile('esbuild.json', { encoding: 'utf-8' });
        const option = {
          ...JSON.parse(optJson).options,
          ...options,
        };

        spinner.text = 'Building apps ...';
        spinner.color = 'green';

        await esbuild.build(option);
        const stop = Date.now();

        spinner.succeed(`Done in ${Number((stop - start) / 1000 / 1000).toFixed(2)}ms`);
      } catch (e) {
        spinner.fail(e.message);
        process.exit(1);
      }
    },
  };
}
