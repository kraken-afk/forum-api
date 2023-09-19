// @ts-check

import * as esbuild from 'esbuild';
import {readFile} from 'node:fs/promises';
import ora from 'ora';

/**
 *
 * @param {import('esbuild').BuildOptions} options
 */
export default function bundler(options) {
	const spinner = ora();

	return {
		async build() {
			const start = Date.now();

			spinner.color = 'yellow';
			spinner.start('Eating esbuild.json ...\n');

			try {
				const optJson = await readFile('esbuild.config.json', {encoding: 'utf-8'});
				/**
				 * @type {import('esbuild').BuildOptions}
				 */
				const option = {
					...JSON.parse(optJson).options,
					...options,
				};

				spinner.text = 'Building apps ...\n';
				spinner.color = 'green';

				await esbuild.build(option);
				const stop = Date.now();

				spinner.succeed(`Done in ${Number(stop - start)}ms\n`);
			} catch (e) {
				spinner.fail(e.message);
				process.exit(1);
			}
		},
	};
}
