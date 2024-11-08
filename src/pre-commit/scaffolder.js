import {scaffold as createHook} from '../hook/index.js';

export default function ({projectRoot, packageManager}) {
  return createHook({projectRoot, hookName: 'pre-commit', script: `${packageManager} test`});
}
