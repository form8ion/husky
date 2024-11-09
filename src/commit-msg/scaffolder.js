import {scaffold as createHook} from '../hook/index.js';

export default function ({projectRoot}) {
  return createHook({projectRoot, hookName: 'commit-msg', script: 'npx --no-install commitlint --edit $1'});
}
