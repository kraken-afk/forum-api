// @ts-check

import { bundler } from './helpers/bundler.js';

await bundler({ outdir: 'target/debug' })
  .build();
