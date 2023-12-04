import { readFile } from 'node:fs/promises';
import * as esbuild from 'esbuild';
import ora from 'ora';
import { routerParser } from './router-parser.mjs';

const ROUTER_PATH = 'src/api/';

/**
 *
 * @param {import('esbuild').BuildOptions} options
 */
export default function bundler(options, router_path = ROUTER_PATH) {
  const spinner = ora();

  return {
    async build() {
      const start = Date.now();

      spinner.color = 'yellow';
      spinner.start('Load esbuild.json ...\n');

      try {
        const optJson = await readFile('esbuild.config.json', {
          encoding: 'utf-8',
        });
        /**
         * @type {import('esbuild').BuildOptions}
         */
        const option = {
          ...JSON.parse(optJson).options,
          ...options,
          define: {
            __OUT_DIR__: `'${options.outdir}'`,
          },
        };

        spinner.text = 'Building apps ...\n';
        spinner.color = 'green';

        await Promise.all([
          esbuild.build(option),
          routerParser(router_path, options.outdir, {
            ...option,
          }),
        ]);
        const stop = Date.now();

        spinner.succeed(`Done in ${Number(stop - start)}ms\n`);
      } catch (e) {
        spinner.fail(e.message);
        process.exit(1);
      }
    },
  };
}
