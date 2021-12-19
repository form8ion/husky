// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {lift, scaffold} from './lib/index.cjs';

// remark-usage-ignore-next
stubbedFs({'package.json': JSON.stringify({scripts: {}})});

// #### Execute

(async () => {
  await scaffold({projectRoot: process.cwd(), packageManager: 'foo'});

  await lift({projectRoot: process.cwd(), packageManager: 'foo'});
})();
