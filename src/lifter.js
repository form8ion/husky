import deepmerge from 'deepmerge';

import {lift as updateConfigToMatchInstalledVersion} from './config/index.js';
import {scaffold as configureCommitMsgHook} from './commit-msg/index.js';
import {lift as liftHooks, test as modernConfigIsUsed} from './hooks/index.js';

export default async function lift({projectRoot, packageManager}, dependencies) {
  const configFormatResults = await updateConfigToMatchInstalledVersion({projectRoot, packageManager}, dependencies);

  if (await modernConfigIsUsed({projectRoot})) {
    await Promise.all([
      liftHooks({projectRoot}),
      configureCommitMsgHook({projectRoot}, dependencies)
    ]);
  }

  return deepmerge(configFormatResults, {scripts: {prepare: 'husky'}});
}
