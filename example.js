// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {lift, scaffold, test} from './lib/index.cjs';

// remark-usage-ignore-next
stubbedFs({'package.json': JSON.stringify({scripts: {}})});

// #### Execute

(async () => {
  await scaffold({projectRoot: process.cwd(), packageManager: 'foo'});

  await test({projectRoot: process.cwd()});

  await lift({projectRoot: process.cwd(), packageManager: 'foo'});
})();
