/* eslint-disable @typescript-eslint/ban-types */
import {transform} from 'esbuild';
import {type PathLike} from 'fs';
import {readFile} from 'fs/promises';

export async function _eval<T>(path: PathLike): Promise<Record<string, T>> {
	const source = await readFile(path);
	const compiledSource = await transform(source, {
		loader: 'ts',
		platform: 'node',
		format: 'esm',
		minify: true,
	});

	const encodedJs = encodeURIComponent(compiledSource.code);
	const dataUri = 'data:text/javascript;charset=utf-8,' + encodedJs;
	return (await import(dataUri)) as Record<string, T>;
}
