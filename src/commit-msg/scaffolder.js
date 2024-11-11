import {exists as configExistsFor} from '@form8ion/config-file';

import {scaffold as createHook} from '../hook/index.js';
import commitMsgHookAlreadyDefined from './tester.js';

export default async function ({projectRoot}) {
  if (await configExistsFor({name: 'commitlint'}) && !(await commitMsgHookAlreadyDefined({projectRoot}))) {
    await createHook({projectRoot, hookName: 'commit-msg', script: 'npx --no-install commitlint --edit $1'});
  }
}
