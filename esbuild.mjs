// @ts-check

import { bundler } from './helpers/bundler.js';

await bundler({ outdir: 'target/release/', minify: true })
  .build();