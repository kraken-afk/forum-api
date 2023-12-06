// @ts-check

import bundler from './utils/scripts/bundler.mjs';

await bundler({ outdir: 'target/release/', minify: true }).build();
