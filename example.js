// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {lift, scaffold, test} from './lib/index.js';

// remark-usage-ignore-next
stubbedFs({'package.json': JSON.stringify({scripts: {}})});

// #### Execute

(async () => {
  const logger = {
    info: () => undefined,
    success: () => undefined,
    warn: () => undefined,
    error: () => undefined
  };

  await scaffold({projectRoot: process.cwd(), packageManager: 'foo'}, {logger});

  await test({projectRoot: process.cwd()}, {logger});

  await lift({projectRoot: process.cwd(), packageManager: 'foo'}, {logger});
})();
