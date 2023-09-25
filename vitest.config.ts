/* eslint-disable @typescript-eslint/naming-convention */
import {resolve} from 'path';
import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		include: [
			'src/**/*.{test,spec}.?(c|m)[jt]s?(x)',
			'__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)',
		],
		reporters: 'verbose',
	},
	resolve: {
		alias: {
			'~': resolve(__dirname, './src'),
		},
	},
});
