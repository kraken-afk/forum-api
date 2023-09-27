import chalk from 'chalk';

export namespace log {
  const _error = chalk.bgRed.black;
  const _errorTxt = chalk.red;
  const __warn = chalk.bgYellow.black;
  const __warnTxt = chalk.yellow;
  const _run = chalk.bgCyan.black;
  const _runTxt = chalk.cyan;
  const _info = chalk.bgCyanBright.black;
  const _infoTxt = chalk.cyanBright;

  export function error(msg?: string, ...optionalParrams: unknown[]) {
    const txt = `${_error('# ERROR # ')} ${_errorTxt(msg)}\n`;
    console.error(txt, optionalParrams.length ? optionalParrams : '');
  }

  export function warning(msg?: string, ...optionalParrams: unknown[]) {
    const txt = `${__warn('⚠ WARNING ⚠ ')} ${__warnTxt(msg)}\n`;
    console.warn(txt, optionalParrams.length ? optionalParrams : '');
  }

  export function run(msg?: string, ...optionalParrams: unknown[]) {
    const txt = `${_run('⚡ RUN ⚡ ')} ${_runTxt(msg)}\n`;
    console.warn(txt, optionalParrams.length ? optionalParrams : '');
  }

  export function info(
    title: string,
    msg?: string,
    ...optionalParrams: unknown[]
  ) {
    const txt = `${_info(`🐶 ${title}: `)} ${_infoTxt(msg)}\n`;
    console.info(txt, optionalParrams.length ? optionalParrams : '');
  }
}
