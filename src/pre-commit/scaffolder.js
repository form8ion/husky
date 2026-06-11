import {scaffold as createHook} from '../hook/index.js';

export default function ({projectRoot, packageManager}, dependencies) {
  return createHook({projectRoot, hookName: 'pre-commit', script: `${packageManager} test`}, dependencies);
}
