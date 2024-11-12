import {applyEnhancers} from '@form8ion/core';

import * as v3ConfigPlugin from './legacy-versions/v3/index.js';
import * as v4ConfigPlugin from './legacy-versions/v4/index.js';

export default function ({projectRoot, packageManager}) {
  return applyEnhancers({
    options: {projectRoot, packageManager},
    enhancers: {v3Config: v3ConfigPlugin, v4Config: v4ConfigPlugin}
  });
}
