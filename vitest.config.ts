import {defineConfig} from 'vitest/config';

export default defineConfig({
	'esbuild': {
		include: ['src/*.{test,spec}.?(c|m)[jt]s?(x)', '__tests__/*.{test,spec}.?(c|m)[jt]s?(x)'],
	},
});
