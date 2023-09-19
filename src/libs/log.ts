import chalk from 'chalk';

export module log {
	const _error = chalk.bgRed.blackBright;
	const _errorTxt = chalk.red;
	const __warn = chalk.bgYellow.blackBright;
	const __warnTxt = chalk.yellow;
	const _run = chalk.bgCyan.blackBright;
	const _runTxt = chalk.cyan;
	const _info = chalk.bgCyanBright.blackBright;
	const _infoTxt = chalk.cyanBright;

	export function error(msg?: string, ...optionalParrams: any[]) {
		const txt = _error('# ERROR #') + ' ' + _errorTxt(msg) + '\n';
		console.error(txt, optionalParrams.length ? optionalParrams : '');
	}

	export function warning(msg?: string, ...optionalParrams: any[]) {
		const txt = __warn('⚠ WARNING ⚠') + ' ' + __warnTxt(msg) + '\n';
		console.warn(txt, optionalParrams.length ? optionalParrams : '');
	}

	export function run(msg?: string, ...optionalParrams: any[]) {
		const txt = _run('⚡ RUN ⚡') + ' ' + _runTxt(msg) + '\n';
		console.warn(txt, optionalParrams.length ? optionalParrams : '');
	}

	export function info(title: string, msg?: string, ...optionalParrams: any[]) {
		const txt = _info(`🐶 ${title}:`) + ' ' + _infoTxt(msg) + '\n';
		console.info(txt, optionalParrams.length ? optionalParrams : '');
	}
}
