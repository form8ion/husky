import {updateConfigToMatchInstalledVersion} from './config.js';
import configureCommitMsgHook from './commit-msg.js';
import {lift as liftHooks, test as modernConfigIsUsed} from '../hooks/index.js';

export default async function ({projectRoot, packageManager}) {
  const configFormatResults = await updateConfigToMatchInstalledVersion({projectRoot, packageManager});

  if (await modernConfigIsUsed({projectRoot})) {
    await Promise.all([
      liftHooks({projectRoot}),
      configureCommitMsgHook({projectRoot})
    ]);
  }

  return configFormatResults;
}
