// @ts-check

import bundler from './utils/helpers/bundler.mjs';

await bundler({outdir: 'target/debug'}).build();
